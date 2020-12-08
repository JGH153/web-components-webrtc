export class DataChannelService {
  static #instance;
  #myDataChannel;

  #callbackOnMessage;

  constructor() {
    // can return existing element in constructor to switch to that
    if (DataChannelService.#instance) {
      return DataChannelService.#instance;
    }
    DataChannelService.#instance = this;
  }

  // TODO on message callback func

  getNewMessages(callbackOnMessage) {
    this.#callbackOnMessage = callbackOnMessage;
  }

  setupDataChannel(myRtcConnection) {
    myRtcConnection.ondatachannel = (event) => {
      const receiveChannel = event.channel;
      receiveChannel.onmessage = (messageEvent) => {
        if (this.#callbackOnMessage) {
          this.#callbackOnMessage(messageEvent.data);
        }
      };
    };

    this.#myDataChannel = myRtcConnection.createDataChannel("myDataChannel");
  }

  sendChatMessage(message) {
    this.#myDataChannel.send(message);
  }
}
