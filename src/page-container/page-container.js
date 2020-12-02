import html from "./page-container.html";
import css from "./page-container.css";
import { setupShadow } from "../helpers";
import { Pages } from "../models/Pages";

// rename to page-router?
export class PageContainer extends HTMLElement {
  #shadow;

  // default page
  #currentPage = Pages.Room;

  constructor() {
    super();
    this.#shadow = setupShadow(this, html, css);
  }

  connectedCallback() {
    this.switchToCorrectPage();
  }

  switchToCorrectPage() {
    const prevPage = this.#shadow.getElementById("CurrentPage");
    if (prevPage) {
      this.#shadow.removeChild(prevPage);
    }
    const newPage = document.createElement(this.#currentPage.component);
    newPage.id = "CurrentPage";
    newPage.addEventListener("ChangePage", (event) => this.setNewPage(event)); // too magical TODO fix
    this.#shadow.appendChild(newPage);
    document.title = this.#currentPage.title;
  }

  setNewPage(event) {
    //TODO set in route and then change based on listening for that. Need service for that
    // https://github.com/FermiDirak/fermidirak.github.io/blob/master/index.js
    console.log(event.detail, "newPage");
    this.#currentPage = event.detail;
    this.switchToCorrectPage();
  }
}
