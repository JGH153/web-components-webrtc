import NewRoomHTML from "./new-room.html";
import css from "./new-room.css";
console.log(css);

export class NewRoom extends HTMLElement {
  shadow;
  constructor() {
    super();

    this.setupShadow();
  }

  setupShadow() {
    console.log(NewRoomHTML, "NewRoomHTML");
    this.shadow = this.attachShadow({ mode: "open" });
    const template = document.createElement("template");
    template.innerHTML = "<style>" + css + "</style>" + NewRoomHTML;
    const templateContent = template.content;
    const shadowRoot = this.shadow.appendChild(templateContent.cloneNode(true));
  }
}
