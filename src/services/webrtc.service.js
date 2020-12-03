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

  setupPeerConnection(stream, onRemoteVideo) {
    const configuration = {
      iceServers: [{ urls: "stun:stun2.1.google.com:19302" }],
    };

    this.#myRtcConnection = new RTCPeerConnection(configuration);

    // setup stream listening
    stream.getTracks().forEach((currentTrack) => {
      this.#myRtcConnection.addTrack(currentTrack, new MediaStream());
    });

    this.#myRtcConnection.ontrack = (event) => {
      onRemoteVideo(event.streams[0]);
      this.#connected = true;
    };

    this.#myRtcConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.#FirebaseService.addIce(this.#roomID, event.candidate.toJSON(), this.#isHost);
      } else {
        // console.log(" All ICE candidates have been sent");
      }
    };

    this.#setupDataChannel();
  }

  async createAndSaveOffer() {
    const offer = await this.#myRtcConnection.createOffer();
    await this.#myRtcConnection.setLocalDescription(offer);
    this.#FirebaseService.setOffer(this.#roomID, offer);
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

  async connectToGuest() {
    // TODO listen for room response, and ICE candidates from other
    this.#FirebaseService.onRoomUpdates(this.#roomID, (doc) => {
      if (doc.guestAnswer) {
        this.#addGuestAnswer(doc.guestAnswer);
      }
    });
    this.#FirebaseService.onRoomIceUpdates(this.#roomID, false, async (candidate) => {
      await this.#myRtcConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    await this.createAndSaveOffer();
  }

  async connectToHost() {
    this.#FirebaseService.onRoomUpdates(this.#roomID, (doc) => {
      if (doc.hostOffer && !this.#haveAnswered) {
        this.#addHostOffer(doc.hostOffer);
      }
    });
    this.#FirebaseService.onRoomIceUpdates(this.#roomID, true, async (candidate) => {
      await this.#myRtcConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });
  }

  async #addHostOffer(offer) {
    this.#haveAnswered = true;
    await this.#myRtcConnection.setRemoteDescription(offer);
    const answer = await this.#myRtcConnection.createAnswer();
    await this.#myRtcConnection.setLocalDescription(answer);
    await this.#FirebaseService.setAnswer(this.#roomID, answer);
  }

  async #addGuestAnswer(answer) {
    await this.#myRtcConnection.setRemoteDescription(answer);
  }

  isHost() {
    return this.#isHost;
  }
}
