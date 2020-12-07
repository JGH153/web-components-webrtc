import { RoomRouterGuard } from "./room.guard";

export const Pages = Object.freeze({
  Home: {
		path: "/",
		component: "home-page",
		title: "Home"
	},
  Room: {
		path: "/room",
		component: "room-page",
		title: "Room",
		// routerGuard: RoomRouterGuard
	},
  About: {
		path: "/about",
		component: "about-page",
		title: "About"
	}
});
