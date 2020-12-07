import html from "./about-page.html";
import css from "./about-page.css";
import { setupShadow } from "../helpers";
import { Pages } from "../models/Pages";

export class AboutPage extends HTMLElement {
  constructor() {
    super();
    setupShadow(this, html, css);
  }

  back() {
    const event = new CustomEvent("ChangePage", { detail: Pages.Home });
    this.dispatchEvent(event);
  }
}
