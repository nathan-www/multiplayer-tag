class Multiplayer {
  constructor(host) {
    [this.onError, this.throwError] = this.tanoy();
    [this.onReady, this.callReady] = this.tanoy();
    [this.onDisconnect, this.callDisconnect] = this.tanoy();
    [this.onSyncPlayer, this.callSyncPlayer] = this.tanoy();
    [this.onRemovePlayer, this.callRemovePlayer] = this.tanoy();
    [this.onTagPlayer, this.callTagPlayer] = this.tanoy();

    this.socket = new WebSocket("ws://" + host);

    this.socket.onerror = (error) => {
      this.throwError("Failed to connect to server");
    };

    this.socket.onopen = () => {
      this.callReady();
    };

    this.socket.onclose = () => {
      this.callDisconnect();
    };

    this.socket.onmessage = (event) => {
      this.receive(event);
    };
  }

  send(message) {
    this.socket.send(JSON.stringify(message));
  }

  receive(message) {
    let messageObj = JSON.parse(message.data);

    if (messageObj.type == "syncPlayer") {
      this.callSyncPlayer(messageObj.player);
    } else if (messageObj.type == "removePlayer") {
      this.callRemovePlayer(messageObj.username);
    } else if (messageObj.type == "tagPlayer") {
      this.callTagPlayer({
        username: messageObj.username,
        start: messageObj.start,
      });
    }
  }

  tagged(username){
      this.send({
          type: "playerTagged",
          username: username
      })
  }

  syncSelf(myself) {
    this.send({
      type: "playerUpdate",
      player: {
        username: myself.username,
        position: myself.getPos(),
        state: myself.state,
        direction: myself.direction,
      },
    });
  }

  tanoy() {
    let handlers = [];
    return [
      (handler) => {
        handlers.push(handler);
      },
      (message) => {
        handlers.forEach((handler) => handler(message));
      },
    ];
  }
}

export default Multiplayer;
