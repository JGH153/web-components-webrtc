export const Collections = Object.freeze({
  Room: "room",
  ICE: "ice", // sub collection under Room
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
    this.#firestore = firebase.firestore();
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

  async saveOffer(roomId, offer) {
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

  async saveAnswer(roomId, answer) {
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

  async saveIce(roomId, iceString, fromHost) {
    await this.#firestore.collection(Collections.Room).doc(roomId).collection(Collections.ICE).add({
      ice: iceString,
      fromHost: fromHost,
    });
  }

  getRoomUpdates(roomId, onDataCallback) {
    this.#firestore
      .collection(Collections.Room)
      .doc(roomId)
      .onSnapshot((doc) => {
        onDataCallback(doc.data());
      });
  }

  getRoomIceUpdates(roomId, fromHost, onDataCallback) {
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
