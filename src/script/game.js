import { game } from "./phaserController";
import Player from "./Player";
import keysDown from "./keytracker";
import Multiplayer from "./multiplayer";

let localPlayers = {};
let myself;
let multiplayerClient;

function updateLocalPlayer(remotePlayer) {
  //Do not update own state from server
  if (myself == undefined || remotePlayer.username !== myself.username) {
    let localPlayer;

    //Create local player if doesn't exist
    if (!localPlayers.hasOwnProperty(remotePlayer.username)) {
      localPlayer = new Player(remotePlayer.username, game.scene);
      localPlayers[localPlayer.username] = localPlayer;
    } else {
      localPlayer = localPlayers[remotePlayer.username];
    }

    //Sync state
    localPlayer.teleport(remotePlayer.position.x, remotePlayer.position.y);
    localPlayer.direction = remotePlayer.direction;
    if (remotePlayer.state == "walking") {
      localPlayer.walk(remotePlayer.direction);
    } else if (remotePlayer.state == "standing") {
      localPlayer.stopWalking();
    }
  }
}

//Create own player
function spawnSelf(username) {
  if (myself == undefined && username.length > 0) {
    myself = new Player(username, game.scene);
    localPlayers[myself.username] = myself;

    myself.onUpdateState(() => {
      syncSelf();
    });

    setInterval(() => {
      //Keyboard controls
      if (keysDown.includes("ArrowUp")) {
        myself.walk("up");
      } else if (keysDown.includes("ArrowDown")) {
        myself.walk("down");
      } else if (keysDown.includes("ArrowLeft")) {
        myself.walk("left");
      } else if (keysDown.includes("ArrowRight")) {
        myself.walk("right");
      } else {
        myself.stopWalking();
      }
    }, 10);

    setInterval(() => {
      //Periodically sync own state
      syncSelf();
    }, 800);
  }
}

function syncSelf() {
  multiplayerClient.syncSelf(myself);
}

game.loaded.then(() => {
  multiplayerClient = new Multiplayer("localhost:5002");

  multiplayerClient.onError((err) => {
    alert(err);
  });

  multiplayerClient.onDisconnect(() => {
    //alert("Disconnected from server!");
  });

  multiplayerClient.onSyncPlayer((remotePlayer) => {
    //Sync remote player state
    updateLocalPlayer(remotePlayer);
  });

  multiplayerClient.onRemovePlayer((username) => {
      //Remove inactive player
      if(localPlayers.hasOwnProperty(username)){
          localPlayers[username].kill();
          delete localPlayers[username];
      }
  })

  multiplayerClient.onReady(() => {
    spawnSelf(prompt("Enter username: "));
  });

  //Nametags follow player
  setInterval(() => {
    Object.values(localPlayers).forEach((player) => {
      player.nametagFollow();
    });
  }, 10);
});
