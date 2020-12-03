import html from "./home-page.html";
import css from "./home-page.css";
import { setupShadow } from "../helpers";
import { WebRTCService } from "../services/webrtc.service";
import { Pages } from "../models/Pages";

export class HomePage extends HTMLElement {
  #WebRTCService = new WebRTCService();
  #inputRoomId = "";

  constructor() {
    super();
    setupShadow(this, html, css);
  }

  async newRoom() {
    await this.#WebRTCService.newRoom();
    this.#gotoRoomPage();
  }

  async joinRoom() {
    if (!this.#inputRoomId) {
      alert("No Room"); // TODO improve
      return;
    }
    const canJoin = await this.#WebRTCService.joinRoom(this.#inputRoomId);
    if (!canJoin) {
      alert(" Room not found");
      return;
    }
    // await this.#WebRTCService.joinRoom(this.#inputRoomId);
    this.#gotoRoomPage();
  }

  roomIdInputChange(element) {
    this.#inputRoomId = element.value;
  }

  #gotoRoomPage() {
    const event = new CustomEvent("ChangePage", { detail: Pages.Room });
    this.dispatchEvent(event);
  }
}