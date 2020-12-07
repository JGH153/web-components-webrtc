import html from "./room-chat.html";
import css from "./room-chat.css";
import { setupShadow } from "../../helpers";
import { WebRTCService } from "../../services/webrtc.service";
import { DataChannelService } from "../../services/dataChannel.service";

export class RoomChat extends HTMLElement {
  #webRTCService = new WebRTCService();
  #DataChannelService = new DataChannelService();
  #chatMessageText = "";

  constructor() {
    super();
    setupShadow(this, html, css);
  }

  connectedCallback() {
    this.#DataChannelService.getNewMessages((message) => {
      console.log("message!, ", message);
      this.addMessageToChat(message, false);
    });
  }

  chatMessageChange(element) {
    this.#chatMessageText = element.value;
  }

  sendChatMessage() {
    this.#DataChannelService.sendChatMessage(this.#chatMessageText);
    this.addMessageToChat(this.#chatMessageText, true);
    this.#chatMessageText = "";
    this.shadowRoot.getElementById("chatMessage").value = this.#chatMessageText;
  }

  addMessageToChat(message, myOwn) {
    const byText = myOwn ? "You: " : "Guest: ";
    const cssClass = myOwn ? "my-message" : "other-message ";
    const chatEl = this.shadowRoot.getElementById("chatList");
    const wrappedMessage = `<div class="${cssClass}"><b>${byText}</b>${message}</div>`;
    chatEl.innerHTML = chatEl.innerHTML + wrappedMessage;
  }
}
