import html from "./about-page.html";
import css from "./about-page.css";
import { setupShadow } from "../helpers";
import { Pages } from "../models/Pages";

export class AboutPage extends HTMLElement {
  #goHomeEvent = new CustomEvent("ChangePage", { detail: Pages.Home });

  constructor() {
    super();
    setupShadow(this, html, css);
  }

  back() {
    this.dispatchEvent(this.#goHomeEvent);
  }
}
