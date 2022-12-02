import { WebSocketServer } from "ws";

const server = new WebSocketServer({ port: 5222 });

console.log("WSS running on port 5222");

server.on("connection", (ws) => {
  ws.on("message", function message(data) {
    receive(data);
  });
});

let players = {};
let tagPlayer = null;
let tagPlayerStart = 0;
let tagPlayerDelay = 5;

function secondsSince(timestamp) {
  return (+new Date() - timestamp) / 1000;
}

function receive(message) {
  let messageObj = JSON.parse(message);

  if (messageObj.type == "playerUpdate") {
    players[messageObj.player.username] = {
      username: messageObj.player.username,
      position: {
        x: messageObj.player.position.x,
        y: messageObj.player.position.y,
      },
      state: messageObj.player.state,
      direction: messageObj.player.direction,
      lastUpdate: +new Date(),
    };
    syncPlayer(messageObj.player.username);
  } else if ((messageObj.type = "playerTagged")) {
    setTagUser(messageObj.username);
  }
}

function broadcast(message) {
  server.clients.forEach((client) => {
    client.send(JSON.stringify(message));
  });
}

function syncPlayer(username) {
  broadcast({
    type: "syncPlayer",
    player: players[username],
  });
}

function removePlayer(username) {
  delete players[username];

  if (tagPlayer == username) {
    setTagUser(null);
  }

  broadcast({
    type: "removePlayer",
    username: username,
  });
}

function setTagUser(username) {
  if (username == null) {
    tagPlayerStart = 0;
  } else {
    tagPlayerStart = +new Date() + tagPlayerDelay * 1000;
  }
  tagPlayer = username;
  broadcastTagPlayer();
}

function broadcastTagPlayer() {
  broadcast({
    type: "tagPlayer",
    username: tagPlayer,
    start: tagPlayerStart,
  });
}

setInterval(() => {
  //Remove inactive players
  Object.values(players).forEach((player) => {
    if (secondsSince(player.lastUpdate) > 2.5) {
      removePlayer(player.username);
    }
  });

  //Set tag user if no tag user
  if (Object.keys(players).length > 1 && tagPlayer == null) {
    setTagUser(
      Object.keys(players)[
        Math.floor(Math.random() * Object.keys(players).length)
      ]
    );
  }

  //Remove tag if only 1 player
  if (tagPlayer !== null && Object.keys(players).length < 2) {
    setTagUser(null);
  }

  //Broadcast tag player
  broadcastTagPlayer();
}, 1000);
