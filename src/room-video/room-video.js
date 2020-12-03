import html from "./room-video.html";
import css from "./room-video.css";
import { setupShadow } from "../helpers";
import { WebRTCService } from "../services/webrtc.service";

export class RoomVideo extends HTMLElement {
  #localVideoStream;
  #remoteVideoStream;
  //  inputs!

  static localVideoAttr = "local-video";

  static get observedAttributes() {
    return [RoomVideo.localVideoAttr];
  }

  constructor() {
    super();
    setupShadow(this, html, css);
  }

  connectedCallback() {}

  // attributeChangedCallback(name, oldValue, newValue) {
  //   // console.log("CardComponent Attributes changed: ", name, oldValue, newValue);
  //   if (name === RoomVideo.localVideoAttr) {
  //   }
  // }

  setLocalVideo(stream) {
    this.#localVideoStream = stream;
    this.shadowRoot.getElementById("localVideo").srcObject = this.#localVideoStream;
  }

  setRemoteVideo(stream) {
    this.#remoteVideoStream = stream;
    this.shadowRoot.getElementById("remoteVideo").srcObject = this.#remoteVideoStream;
  }
}
