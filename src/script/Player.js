class Player {
  constructor(username, scene, myself = false) {
    [this.onUpdateState, this.callUpdateState] = this.tanoy();

    this.scene = scene;
    this.direction = "down";
    this.state = "standing";
    this.username = username;
    this.sprite = scene.physics.add.sprite(0, 0, "playerSpritesheet");
    this.sprite.setCircle(1, 8, 22);
    this.scene.physics.add.collider(this.sprite, this.scene.collisionLayer);
    this.stopWalking();
    this.teleport(185, 115); //Spawn in a covenient place
    this.createNametag();
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
    this.nametag.innerText = this.username;

    document.querySelector("#game-container").appendChild(this.nametag);

    let bubble = document.createElement("div");
    bubble.classList.add("bubble");
    this.nametag.appendChild(bubble);

    this.nametagFollow();
  }

  destroyNametag(){
    this.nametag.remove();
  }

  kill() {
    this.sprite.destroy();
    this.destroyNametag();
  }

  nametagFollow() {
    let pos = this.getPos();
    this.nametag.style.left = pos.containerX + "px";
    this.nametag.style.top = pos.containerY + "px";
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
