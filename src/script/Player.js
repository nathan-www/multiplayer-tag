class Player {
  constructor(username, scene, localPlayers) {
    [this.onUpdateState, this.callUpdateState] = this.tanoy();
    [this.onPlayerCollision, this.callPlayerCollision] = this.tanoy();

    this.scene = scene;
    this.direction = "down";
    this.state = "standing";
    this.username = username;

    this.sprite = scene.physics.add.sprite(0, 0, "playerSpritesheet");
    this.sprite.setCircle(1, 8, 22);

    //Create invisible halo sprite - for player-player overlap detection
    this.spriteHalo = scene.physics.add.sprite(0, 0, "playerSpritesheet");
    this.spriteHalo.visible = false;

    this.scene.physics.add.collider(this.sprite, this.scene.collisionLayer);
    this.stopWalking();
    this.teleport(185, 115); //Spawn in a covenient place
    this.createNametag();

    //Add colliders with all other players
    Object.values(localPlayers).forEach((player) => {
      this.scene.physics.add.overlap(player.spriteHalo, this.spriteHalo, () => {
        this.callPlayerCollision([username, player.username]);
      });
    });
  }

  //Invisible halo sprite follow
  haloFollow() {
    this.spriteHalo.setPosition(this.sprite.x, this.sprite.y);
  }

  animate(type, direction) {
    this.sprite.anims.play(
      type + direction[0].toUpperCase() + direction.substr(1),
      true
    );
  }

  createNametag() {
    this.nametag = document.createElement("div");
    this.nametag.classList.add("nametag");

    document.querySelector("#game-container").appendChild(this.nametag);

    let bubble = document.createElement("div");
    bubble.classList.add("bubble");
    this.nametag.appendChild(bubble);

    let name = document.createElement("p");
    this.nametag.appendChild(name);
    name.innerText = this.username;

    let tagStatus = document.createElement("p");
    tagStatus.classList.add("tag-status");
    this.nametag.appendChild(tagStatus);
    tagStatus.innerText = "";

    this.nametagUpdate();
  }

  nametagUpdate(tag = null) {
    let pos = this.getPos();
    this.nametag.style.left = pos.containerX + "px";
    this.nametag.style.top = pos.containerY + "px";

    if (tag !== null && tag.player == this.username && tag.countdown == 0) {
      this.nametag.querySelector(".tag-status").innerText = "IT!";
    } else if (
      tag !== null &&
      tag.player == this.username &&
      tag.countdown > 0
    ) {
      this.nametag.querySelector(".tag-status").innerText = tag.countdown;
    } else {
      this.nametag.querySelector(".tag-status").innerText = "";
    }
  }

  destroyNametag() {
    this.nametag.remove();
  }

  kill() {
    this.sprite.destroy();
    this.destroyNametag();
  }

  updateState() {
    this.callUpdateState();
  }

  getPos() {
    return {
      x: this.sprite.x,
      y: this.sprite.y,
      containerX: this.sprite.x - this.scene.cameras.main.scrollX,
      containerY: this.sprite.y - this.scene.cameras.main.scrollY,
    };
  }

  walk(direction, speed = 80) {
    let changedState = false;
    if (this.state !== "walking" || this.direction !== direction) {
      changedState = true;
    }

    this.direction = direction;
    this.state = "walking";
    this.animate("walk", direction);

    if (direction == "up") {
      this.sprite.setVelocityX(0);
      this.sprite.setVelocityY(-speed);
    } else if (direction == "down") {
      this.sprite.setVelocityX(0);
      this.sprite.setVelocityY(speed);
    } else if (direction == "left") {
      this.sprite.setVelocityX(-speed);
      this.sprite.setVelocityY(0);
    } else if (direction == "right") {
      this.sprite.setVelocityX(speed);
      this.sprite.setVelocityY(0);
    }

    if (changedState) {
      this.updateState();
    }
  }

  stopWalking() {
    if (this.state !== "standing") {
      this.animate("stand", this.direction);
      this.state = "standing";
      this.sprite.setVelocityX(0);
      this.sprite.setVelocityY(0);
      this.updateState();
    }
  }

  teleport(x, y) {
    if (this.getPos().x !== x || this.getPos().y !== y) {
      this.sprite.setPosition(x, y);
      this.updateState();
    }
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

export default Player;
