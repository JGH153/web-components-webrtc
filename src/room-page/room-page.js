import html from "./room-page.html";
import css from "./room-page.css";
import { setupShadow } from "../helpers";
import { WebRTCService } from "../services/webrtc.service";
import { DataChannelService } from "../services/dataChannel.service";

export class RoomPage extends HTMLElement {
  #localVideoStream;
  #webRTCService = new WebRTCService();

  #roomID;
  #connected = false;

  constructor() {
    super();
    setupShadow(this, html, css);
  }

  connectedCallback() {
    this.#roomID = this.#webRTCService.getRoomId();
    this.shadowRoot.getElementById("roomID").innerText = this.#roomID;
    if (this.#webRTCService.getIsHost()) {
      this.addRoomIdToClipboard();
    }
    this.setupVideo();
  }

  async addRoomIdToClipboard() {
    await navigator.clipboard.writeText(this.#roomID);
    // send to other tab auto
    const bc = new BroadcastChannel("room-auto-join");
    bc.postMessage(this.#roomID);
  }

  async setupVideo() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const desired = devices.find((current) => current.label === "Logi Capture");
    const videoResRequest = { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 60 } };
    let request = { video: videoResRequest, audio: false };
    if (desired) {
      request = { video: { deviceId: { exact: desired.deviceId } }, audio: false };
    }

    // navigator.mediaDevices.getDisplayMedia().then(
    navigator.mediaDevices.getUserMedia(request).then(
      (stream) => this.onUserAllowVideo(stream),
      (error) => {
        console.warn(error);
        alert("Can't get camera");
      }
    );
  }

  onRemoteVideo(remoteTrack) {
    const videoElement = this.shadowRoot.getElementById("video");
    videoElement.setRemoteVideo(remoteTrack);
    this.#connected = true;
    this.showChat();
  }

  onUserAllowVideo(stream) {
    this.#localVideoStream = stream;
    this.#webRTCService.setupPeerConnection(this.#localVideoStream, this.onRemoteVideo.bind(this));

    const videoElement = this.shadowRoot.getElementById("video");
    // console.log(SON.stringify(this.#localVideoStream)); // can't stringify MediaStream
    videoElement.setLocalVideo(this.#localVideoStream);

    this.#webRTCService.connectToOtherPerson();
  }

  showChat() {
    const chatElement = document.createElement("room-chat");
    this.shadowRoot.appendChild(chatElement);
  }
}
