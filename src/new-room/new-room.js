import html from "./new-room.html";
import css from "./new-room.css";
import { setupShadow } from "../helpers";
import { WebRTCService } from "../services/webrtc.service";
import { Pages } from "../models/Pages";

export class NewRoom extends HTMLElement {
  #shadow;

  #WebRTCService = new WebRTCService();

  constructor() {
    super();
    this.#shadow = setupShadow(this, html, css);
  }

  newRoom() {
    this.#WebRTCService.newRoom();
    const event = new CustomEvent("ChangePage", { detail: Pages.Room });
    this.dispatchEvent(event);
  }
}
