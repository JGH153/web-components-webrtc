export class WebRTCService {
  static #instance;
  #myRtcConnection;
  constructor() {
    // can return existing element in constructor to switch to that
    if (WebRTCService.#instance) {
      return WebRTCService.#instance;
    }
    WebRTCService.#instance = this;
  }

  setupPeerConnection(stream) {
    const configuration = {
      iceServers: [{ urls: "stun:stun2.1.google.com:19302" }],
		};
		
		this.#myRtcConnection = new RTCPeerConnection(configuration);
  }

  newRoom() {
    console.log("new room");
  }
}
