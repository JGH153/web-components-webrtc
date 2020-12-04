import { FirebaseService } from "./firebase.service";

export class WebRTCService {
  static #instance;
  #FirebaseService = new FirebaseService();
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

  getRoomId() {
    return this.#roomID;
  }

  async newRoom() {
    this.#roomID = await this.#FirebaseService.newRoom();
    this.#isHost = true;
  }

  async joinRoom(roomId) {
    const canJoin = await this.#FirebaseService.roomExist(roomId);
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
      this.#myRtcConnection.addTrack(currentTrack, new MediaStream());
    });

    // remote video
    this.#myRtcConnection.ontrack = (event) => {
      onRemoteVideo(event.streams[0]); // TODO support more than one
      this.#connected = true;
    };

    this.#myRtcConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.#FirebaseService.saveIce(this.#roomID, event.candidate.toJSON(), this.#isHost);
      } else {
        // console.log(" All ICE candidates have been sent");
        console.log("Other!", event);
      }
    };

    this.#setupDataChannel();
  }

  async createAndSaveOffer() {
    const offer = await this.#myRtcConnection.createOffer();
    await this.#myRtcConnection.setLocalDescription(offer);
    this.#FirebaseService.saveOffer(this.#roomID, offer);
  }

  #setupDataChannel() {
    this.#myRtcConnection.ondatachannel = (event) => {
      const receiveChannel = event.channel;
      receiveChannel.onmessage = (messageEvent) => {
        this.onDataChannelNewMessage(messageEvent);
      };
    };

    this.myDataChannel = this.#myRtcConnection.createDataChannel("myDataChannel");
  }

  async connectToOtherPerson() {


    this.#FirebaseService.getRoomUpdates(this.#roomID, (doc) => {
      if (doc.guestAnswer && this.#isHost) {
        this.#addGuestAnswer(doc.guestAnswer);
      }
      if (doc.hostOffer && !this.#haveAnswered && !this.#isHost) {
        this.#addHostOffer(doc.hostOffer);
      }
    });

    this.#FirebaseService.getRoomIceUpdates(this.#roomID, !this.#isHost, async (candidate) => {
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
    await this.#FirebaseService.saveAnswer(this.#roomID, answer);
  }

  async #addGuestAnswer(answer) {
    await this.#myRtcConnection.setRemoteDescription(answer);
  }
}
