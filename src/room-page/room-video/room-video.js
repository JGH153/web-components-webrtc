import html from "./room-video.html";
import css from "./room-video.css";
import { setupShadow } from "../../helpers";
import { WebRTCService } from "../../services/webrtc.service";

export class RoomVideo extends HTMLElement {
  #localVideoStream;
  #remoteVideoStream;

  constructor() {
    super();
    setupShadow(this, html, css);
  }

  setLocalVideo(stream) {
    this.#localVideoStream = stream;
    this.shadowRoot.getElementById("localVideo").srcObject = this.#localVideoStream;
  }

  setRemoteVideo(stream) {
    this.#remoteVideoStream = stream;
    this.shadowRoot.getElementById("remoteVideo").srcObject = this.#remoteVideoStream;
  }
}
