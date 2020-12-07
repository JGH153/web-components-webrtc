import { DataChannelService } from "./dataChannel.service";
import { FirebaseService } from "./firebase.service";

export class WebRTCService {
  static #instance;
  #firebaseService = new FirebaseService();
  #dataChannelService = new DataChannelService();
  #myRtcConnection;
  #roomID; // FB collection id
  #isHost = null;
  #connected = false;

  #haveAnswered = false;
  constructor() {
    // can return existing element in constructor to switch to that
    if (WebRTCService.#instance) {
      return WebRTCService.#instance;
    }
    WebRTCService.#instance = this;
  }

  getIsHost() {
    return this.#isHost;
  }

  getRoomId() {
    return this.#roomID;
  }

  async newRoom() {
    this.#roomID = await this.#firebaseService.newRoom();
    this.#isHost = true;
  }

  async joinRoom(roomId) {
    const canJoin = await this.#firebaseService.roomExist(roomId);
    if (canJoin) {
      this.#isHost = false;
      this.#roomID = roomId;
    }
    return canJoin;
  }

  setupPeerConnection(stream, onRemoteVideo) {
    const configuration = {
      iceServers: [{ urls: "stun:stun2.1.google.com:19302" }],
    };

    this.#myRtcConnection = new RTCPeerConnection(configuration);

    // my video
    stream.getTracks().forEach((currentTrack) => {
      // console.log(currentTrack.getCapabilities());
      this.#myRtcConnection.addTrack(currentTrack, new MediaStream());
    });

    // remote video
    this.#myRtcConnection.ontrack = (event) => {
      onRemoteVideo(event.streams[0]); // TODO support more than one
      this.#connected = true;
    };

    this.#myRtcConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.#firebaseService.saveIce(this.#roomID, event.candidate.toJSON(), this.#isHost);
      } else {
        // console.log(" All ICE candidates have been sent");
        // console.log("Other!", event);
      }
    };

    this.#dataChannelService.setupDataChannel(this.#myRtcConnection);
  }

  async createAndSaveOffer() {
    const offer = await this.#myRtcConnection.createOffer();
    await this.#myRtcConnection.setLocalDescription(offer);
    this.#firebaseService.saveOffer(this.#roomID, offer);
  }

  async connectToOtherPerson() {
    this.#firebaseService.getRoomUpdates(this.#roomID, (doc) => {
      if (doc.guestAnswer && this.#isHost) {
        this.#addGuestAnswer(doc.guestAnswer);
      }
      if (doc.hostOffer && !this.#haveAnswered && !this.#isHost) {
        this.#addHostOffer(doc.hostOffer);
      }
    });

    this.#firebaseService.getRoomIceUpdates(this.#roomID, !this.#isHost, async (candidate) => {
      await this.#myRtcConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    if (this.#isHost) {
      await this.createAndSaveOffer();
    }
  }

  async #addHostOffer(offer) {
    this.#haveAnswered = true;
    await this.#myRtcConnection.setRemoteDescription(offer);
    const answer = await this.#myRtcConnection.createAnswer();
    await this.#myRtcConnection.setLocalDescription(answer);
    await this.#firebaseService.saveAnswer(this.#roomID, answer);
  }

  async #addGuestAnswer(answer) {
    await this.#myRtcConnection.setRemoteDescription(answer);
  }
}
