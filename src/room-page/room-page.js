import html from "./room-page.html";
import css from "./room-page.css";
import { setupShadow } from "../helpers";
import { WebRTCService } from "../services/webrtc.service";

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

  async addRoomIdToClipboard() {
    await navigator.clipboard.writeText(this.#roomID);
  }

  async setupVideo() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const desired = devices.find((current) => current.label === "Logi Capture");
    let request = { video: true, audio: false };
    if (desired) {
      request = { video: { deviceId: { exact: desired.deviceId } }, audio: false };
    }

    // navigator.mediaDevices.getDisplayMedia().then(
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
    // console.log(SON.stringify(this.#localVideoStream)); // can't stringify MediaStream
    videoElement.setLocalVideo(this.#localVideoStream);

    this.#webRTCService.connectToOtherPerson();
  }
}
