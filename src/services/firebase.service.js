export const Collections = Object.freeze({
  Room: "room",
  ICE: "ice", // sub under Room
  // TODO one sub for caller and one for answerer?
});

export class FirebaseService {
  static #instance;
  #firestore;
  constructor() {
    // can return existing element in constructor to switch to that
    if (FirebaseService.#instance) {
      return FirebaseService.#instance;
    }
    FirebaseService.#instance = this;
  }

  onInit() {
    this.#firestore = firebase.firestore();
  }

  // https://github.com/webrtc/FirebaseRTC/blob/solution/public/app.js
  async setOffer(roomId, offer) {
    await this.#firestore
      .collection(Collections.Room)
      .doc(roomId)
      .update({
        hostOffer: {
          type: offer.type,
          sdp: offer.sdp,
        },
      });
  }

  async setAnswer(roomId, answer) {
    await this.#firestore
      .collection(Collections.Room)
      .doc(roomId)
      .update({
        guestAnswer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      });
  }

  // timestamp for time sort?
  async addIce(roomId, iceString, fromHost) {
    await this.#firestore.collection(Collections.Room).doc(roomId).collection(Collections.ICE).add({
      ice: iceString,
      fromHost: fromHost,
    });
  }

  async newRoom() {
    const item = {
      open: true,
      hostOffer: null, // one to create room
      guestAnswer: null, // one to join room
    };

    const response = await this.#firestore.collection(Collections.Room).add(item);
    return response.id;
  }

  async roomExist(roomId) {
    const docSnapshot = await this.#firestore.collection(Collections.Room).doc(roomId).get();
    return docSnapshot.exists;
  }

  addToCollection(collection, item) {
    return this.#firestore.collection(Collections.Room).add(item);
  }

  onRoomUpdates(roomId, onDataCallback) {
    this.#firestore
      .collection(Collections.Room)
      .doc(roomId)
      .onSnapshot((doc) => {
        onDataCallback(doc.data());
      });
  }

  onRoomIceUpdates(roomId, fromHost, onDataCallback) {
    this.#firestore
      .collection(Collections.Room)
      .doc(roomId)
      .collection(Collections.ICE)
      .where("fromHost", "==", fromHost)
      .onSnapshot((docs) => {
        docs.docChanges().forEach((change) => {
          if (change.type === "added") {
            onDataCallback(change.doc.data().ice);
          }
        });
      });
  }
}
