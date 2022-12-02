import { game } from "./phaserController";
import Player from "./Player";
import keysDown from "./keytracker";
import Multiplayer from "./multiplayer";

let localPlayers = {};
let myself;
let multiplayerClient;

let tagPlayer = null;
let tagPlayerStart = 0;
let lastTagTime = 0;

function secondsBetween(timestamp) {
  return Math.abs(+new Date() - timestamp) / 1000;
}

function tagStatus() {
  if (tagPlayer == null) {
    return {
      player: null,
      countdown: 0,
    };
  } else if (tagPlayerStart > +new Date()) {
    return {
      player: tagPlayer,
      countdown: Math.ceil(secondsBetween(tagPlayerStart)),
    };
  } else {
    return {
      player: tagPlayer,
      countdown: 0,
    };
  }
}

function handlePlayerCollision(collision) {
  if (
    tagPlayer !== null &&
    tagStatus().countdown == 0 &&
    secondsBetween(lastTagTime) > 1
  ) {
    if (collision[0] == tagPlayer || collision[1] == tagPlayer) {
      //Tag happened!
      lastTagTime = +new Date();

      if (collision[0] == tagPlayer) {
        multiplayerClient.tagged(collision[1]);
      } else {
        multiplayerClient.tagged(collision[0]);
      }
    }
  }
}

function updateAnnouncement() {
  let announcementEl = document.querySelector("h1.announcement");
  let status = tagStatus();

  if (Object.keys(localPlayers).length < 2 && status.player == null) {
    announcementEl.innerText = "Waiting for more players...";
    announcementEl.style.display = "block";
  } else if (status.player == null) {
    announcementEl.style.display = "none";
  } else if (status.countdown > 0) {
    announcementEl.innerText =
      status.player + " is it! (" + status.countdown + ")";
    announcementEl.style.display = "block";
  } else {
    announcementEl.innerText = status.player + " is it!";
    announcementEl.style.display = "block";
  }
}

function updateLocalPlayer(remotePlayer) {
  //Do not update own state from server
  if (myself == undefined || remotePlayer.username !== myself.username) {
    let localPlayer;

    //Create local player if doesn't exist
    if (!localPlayers.hasOwnProperty(remotePlayer.username)) {
      localPlayer = new Player(remotePlayer.username, game.scene, localPlayers);
      localPlayer.onPlayerCollision((collision) => {
        handlePlayerCollision(collision);
      });
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
    myself = new Player(username, game.scene, localPlayers);
    myself.onPlayerCollision((collision) => {
      handlePlayerCollision(collision);
    });
    localPlayers[myself.username] = myself;

    myself.onUpdateState(() => {
      syncSelf();
    });
    syncSelf();

    setInterval(() => {
      //Keyboard controls

      let canMove = tagStatus().countdown == 0 || tagPlayer !== myself.username;

      if (keysDown.includes("ArrowUp") && canMove) {
        myself.walk("up");
      } else if (keysDown.includes("ArrowDown") && canMove) {
        myself.walk("down");
      } else if (keysDown.includes("ArrowLeft") && canMove) {
        myself.walk("left");
      } else if (keysDown.includes("ArrowRight") && canMove) {
        myself.walk("right");
      } else {
        myself.stopWalking();
      }
    }, 10);

    setInterval(() => {
      //Periodically sync own state
      syncSelf();
    }, 500);
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
    if (
      localPlayers.hasOwnProperty(username) &&
      (myself == undefined || myself.username !== username)
    ) {
      localPlayers[username].kill();
      delete localPlayers[username];
    }
  });

  multiplayerClient.onTagPlayer((obj) => {
    //Set the current tag user
    tagPlayer = obj.username;
    tagPlayerStart = obj.start;
  });

  multiplayerClient.onReady(() => {
    spawnSelf(prompt("Enter username: "));
  });

  setInterval(() => {
    Object.values(localPlayers).forEach((player) => {
      player.nametagUpdate(tagStatus()); //Nametags follow player
      player.haloFollow(); //Update invisible halo pos
    });

    //Update announcement text
    updateAnnouncement();
  }, 10);
});
