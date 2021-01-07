import html from "./room-page.html";
import css from "./room-page.css";
import { setupShadow } from "../helpers";
import { WebRTCService } from "../services/webrtc.service";
import { DataChannelService } from "../services/data-channel.service";
import { Pages } from "../models/Pages";

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
    // no room id, no fun
    if (!this.#webRTCService.getRoomId()) {
      this.#returnToHome();
      return false;
    }

    this.#roomID = this.#webRTCService.getRoomId();
    this.shadowRoot.getElementById("roomID").innerText = this.#roomID;
    if (this.#webRTCService.getIsHost()) {
      this.addRoomIdToClipboard();
      this.sendBcMessageWithRoomId();
    }
    this.setupVideo();
  }

  #returnToHome() {
    const event = new CustomEvent("ChangePage", { detail: Pages.Home });
    this.dispatchEvent(event);
  }

  async addRoomIdToClipboard() {
    await navigator.clipboard.writeText(this.#roomID);
  }

  sendBcMessageWithRoomId() {
    const bc = new BroadcastChannel("room-auto-join");
    bc.postMessage(this.#roomID);
    bc.close();
  }

  #getDesiredCameraId(devices) {
    const main = devices.find((current) => current.label === "Logi Capture");
    if (this.#webRTCService.getIsHost()) {
      return main;
    } else {
      const extra = devices.find((current) => current.label === "Microsoft® LifeCam Studio(TM) (045e:0772)");
      if (extra) {
        return extra;
      }
      return main;
    }
  }

  async setupVideo() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    let videoResRequest = { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 60 } };

    const desired = this.#getDesiredCameraId(devices);
    if (desired) {
      videoResRequest = { ...videoResRequest, deviceId: desired.deviceId };
    }
    const request = { video: videoResRequest, audio: false };

    // navigator.mediaDevices.getDisplayMedia().then(
    navigator.mediaDevices.getUserMedia(request).then(
      (stream) => this.onUserAllowVideo(stream),
      (error) => {
        console.warn(error);
        alert("Can't get camera 😞");
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

    // console.log(JSON.stringify(this.#localVideoStream)); // can't stringify MediaStream
    const videoElement = this.shadowRoot.getElementById("video");
    videoElement.setLocalVideo(this.#localVideoStream);

    this.#webRTCService.connectToOtherPerson();
  }

  showChat() {
    const chatElement = document.createElement("room-chat");
    this.shadowRoot.appendChild(chatElement);
  }
}
