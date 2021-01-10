import html from "./page-router.html";
import css from "./page-router.css";
import { setupShadow } from "../helpers";
import { Pages } from "../models/Pages";

export class PageRouter extends HTMLElement {
  #currentPage;
  #defaultPage = Pages.Home;

  constructor() {
    super();
    setupShadow(this, html, css);
  }

  connectedCallback() {
    this.#currentPage = this.#getCurrentPageFromUrl();
    this.#renderCorrectPage();

    window.addEventListener("popstate", (event) => {
      if (event.state) {
        this.#currentPage = event.state;
      } else {
        this.#currentPage = this.#defaultPage;
      }
      this.#renderCorrectPage();
    });
  }

  #renderCorrectPage() {
    const elementId = "CurrentPage";
    const prevPage = this.shadowRoot.getElementById(elementId);
    if (prevPage) {
      this.shadowRoot.removeChild(prevPage);
    }

    const newPage = document.createElement(this.#currentPage.component);
    newPage.id = elementId;
    newPage.addEventListener("ChangePage", (event) =>
      this.#gotoNewPage(event.detail)
    );
    this.shadowRoot.appendChild(newPage);

    const title = this.#currentPage.title;
    document.title = title;
  }

  #gotoNewPage(newPage) {
    this.#currentPage = newPage;
    this.#addCurrentPageToHistory();
    this.#renderCorrectPage();
  }

  #addCurrentPageToHistory() {
    history.pushState(
      this.#currentPage,
      this.#currentPage.title,
      window.location.origin + this.#currentPage.path
    );
  }

  #getCurrentPageFromUrl() {
    for (const current in Pages) {
      if (Pages[current].path === window.location.pathname) {
        return Pages[current];
      }
    }
    return this.#defaultPage;
  }
}
