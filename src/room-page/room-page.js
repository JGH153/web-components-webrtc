import html from "./room-page.html";
import css from "./room-page.css";
import { setupShadow } from "../helpers";
import { WebRTCService } from "../services/webrtc.service";
import { RoomVideo } from "../room-video/room-video";

export class RoomPage extends HTMLElement {
  #localVideoStream;
  #webRTCService = new WebRTCService();
  #roomID;

  constructor() {
    super();
    setupShadow(this, html, css);
  }

  connectedCallback() {
    this.#roomID = this.#webRTCService.getRoomId();
    this.shadowRoot.getElementById("roomID").innerText = this.#roomID;
    this.addRoomIdToClipboard();
    this.setupVideo();
  }

  addRoomIdToClipboard() {
    navigator.clipboard.writeText(this.#roomID).then(() => {});
  }

  async setupVideo() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const desired = devices.find((current) => current.label === "Logi Capture");
    let request = { video: true, audio: false };
    if (desired) {
      request = { video: { deviceId: { exact: desired.deviceId } }, audio: false };
    }

    navigator.mediaDevices.getUserMedia(request).then(
      (stream) => this.onUserAllowVideo(stream),
      (error) => console.warn(error)
    );
  }

  onRemoteVideo(remoteTrack) {
    const videoElement = this.shadowRoot.getElementById("video");
    videoElement.setRemoteVideo(remoteTrack);
  }

  onUserAllowVideo(stream) {
    this.#localVideoStream = stream;
    this.#webRTCService.setupPeerConnection(this.#localVideoStream, this.onRemoteVideo.bind(this));

    const videoElement = this.shadowRoot.getElementById("video");
    videoElement.setLocalVideo(this.#localVideoStream);

    if (this.#webRTCService.isHost()) {
      this.#webRTCService.connectToGuest();
    } else {
      this.#webRTCService.connectToHost();
    }
  }
}
