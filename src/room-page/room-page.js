import html from "./room-page.html";
import css from "./room-page.css";
import { setupShadow } from "../helpers";
import { WebRTCService } from "../services/webrtc.service";
import { RoomVideo } from "../room-video/room-video";

export class RoomPage extends HTMLElement {
  #shadow;
  #localVideoStream;
  #webRTCService = new WebRTCService();

  constructor() {
    super();
    this.#shadow = setupShadow(this, html, css);
  }

  connectedCallback() {
    this.setupVideo(); // why not await here?
  }

  async setupVideo() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const desired = devices.find((current) => current.label === "Logi Capture");
    let request = { video: true, audio: false };
    if (desired) {
      request = { video: { deviceId: { exact: desired.deviceId } }, audio: false };
    }

    navigator.mediaDevices.getUserMedia(request).then(
      (stream) => {
        this.#localVideoStream = stream;
        this.#webRTCService.setupPeerConnection(this.#localVideoStream);

        const videoElement = this.#shadow.getElementById("video");
        videoElement.setLocalVideo(this.#localVideoStream);
        // this.setupDataChannel(); TODO
      },
      (error) => {
        console.warn(error);
      }
    );
  }
}
