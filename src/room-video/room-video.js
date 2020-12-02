import html from "./room-video.html";
import css from "./room-video.css";
import { setupShadow } from "../helpers";
import { WebRTCService } from "../services/webrtc.service";

export class RoomVideo extends HTMLElement {
  #shadow;
  #localVideoStream;
  //  inputs!

  static localVideoAttr = "local-video";

  static get observedAttributes() {
    return [RoomVideo.localVideoAttr];
  }

  constructor() {
    super();
    this.#shadow = setupShadow(this, html, css);
  }

  connectedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("CardComponent Attributes changed: ", name, oldValue, newValue);
    const value = JSON.parse(newValue);
    if (name === RoomVideo.localVideoAttr) {
      this.#localVideoStream = value;
      console.log("post", this.#localVideoStream);
      // this.#shadow.getElementById("localVideo").srcObject = this.#localVideoStream;
    }
  }

  setLocalVideo(stream) {
    this.#localVideoStream = stream;
    this.#shadow.getElementById("localVideo").srcObject = this.#localVideoStream;
  }
}
