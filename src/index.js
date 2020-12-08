import { HomePage } from "./home-page/home-page";
import { PageRouter } from "./page-router/page-router";
import { RoomPage } from "./room-page/room-page";
import { RoomVideo } from "./room-page/room-video/room-video";
import { RoomChat } from "./room-page/room-chat/room-chat";
import { AboutPage } from "./about-page/about-page";
import { TextInput } from "./text-input/text-input";

var firebaseConfig = {
  apiKey: "AIzaSyCgTQkGRQBqmvCY4u6wuJ1MTVQ7YPViUig",
  authDomain: "web-components-webrtc.firebaseapp.com",
  databaseURL: "https://web-components-webrtc.firebaseio.com",
  projectId: "web-components-webrtc",
  storageBucket: "web-components-webrtc.appspot.com",
  messagingSenderId: "57628399273",
  appId: "1:57628399273:web:c01bfb9b6cf5d164007bb8",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// define all custom elements (components)
customElements.define("page-router", PageRouter);
customElements.define("home-page", HomePage);
customElements.define("about-page", AboutPage);
customElements.define("room-page", RoomPage);
customElements.define("room-video", RoomVideo);
customElements.define("room-chat", RoomChat);

// define all custom elements (directives)
customElements.define("text-input", TextInput, { extends: "input" });
