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

  newRoom() {
    console.log("new room");
  }

  addToCollection(collection, item) {
    return this.#firestore.collection("expenses").add(item);
  }
}
