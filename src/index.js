import { NewRoom } from "./new-room/new-room";
import { CardComponent } from "./card-component/card-component";

// definbe all custum elements
customElements.define("new-room", NewRoom);
customElements.define("card-component", CardComponent);

if (module.hot) {
  console.log("module.hot");
}
