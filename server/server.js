import { WebSocketServer } from "ws";

const server = new WebSocketServer({ port: 5002 });

server.on("connection", (ws) => {
  ws.on("message", function message(data) {
    receive(data);
  });
});

let players = {};

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
    console.log("killed " + username);
    broadcast({
      type: "removePlayer",
      username: username,
    });
  }

setInterval(() => {
    //Remove inactive players
    Object.values(players).forEach((player) => {

        if((+(new Date()) - player.lastUpdate)/1000 > 4){
            removePlayer(player.username);
            delete players[player.username];
        }
    })
}, 2000)
