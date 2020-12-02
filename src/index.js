import { NewRoom } from "./new-room/new-room";
import { CardComponent } from "./card-component/card-component";
import { PageContainer } from "./page-container/page-container";
import { RoomPage } from "./room-page/room-page";
import { FirebaseService } from "./services/firebase.service";
import { RoomVideo } from "./room-video/room-video";

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

//init services
new FirebaseService().onInit();

// define all custom elements
customElements.define("page-container", PageContainer);
customElements.define("new-room", NewRoom);
customElements.define("room-page", RoomPage);
customElements.define("room-video", RoomVideo);
customElements.define("card-component", CardComponent);
