import html from "./new-room.html";
import css from "./new-room.css";
import { setupShadow } from "../helpers";

export class NewRoom extends HTMLElement {
  shadow;
  constructor() {
    super();
    this.setupShadow();
  }

  newRoom() {
    console.log("new room");
  }

  setupShadow() {
    this.shadow = setupShadow(this, html, css);
  }
}
