import Phaser from "phaser";

let game;
let player;
let cursors;
let walkDirection = "Down";

window.addEventListener("load", () => {
  let config = {
    width: window.innerWidth,
    height: window.innerHeight,
    type: Phaser.AUTO,
    parent: document.querySelector("#game-container"),
    scene: [GameScene],
    physics: {
      default: "arcade",
    },
    pixelArt: true,
  };

  game = new Phaser.Game(config);
});

class GameScene extends Phaser.Scene {
  constructor() {
    super("gameScene");
    window.game = this;
  }

  preload() {
    cursors = this.input.keyboard.createCursorKeys();

    this.load.image(
      "room_builder",
      "src/assets/Modern tiles_Free/interiors/16x16/Room_Builder_free_16x16.png"
    );
    this.load.image(
      "interiors",
      "src/assets/Modern tiles_Free/interiors/16x16/Interiors_free_16x16.png"
    );
    this.load.tilemapTiledJSON("tilemap", "src/assets/room.json");

    this.load.spritesheet(
      "playerSpritesheet",
      "src/assets/Modern tiles_Free/characters/Adam_16x16.png",
      {
        frameWidth: 16,
        frameHeight: 32,
      }
    );
  }

  create() {
    const map = this.make.tilemap({ key: "tilemap" });
    const roomBuilderTileset = map.addTilesetImage(
      "Room_Builder_free_16x16",
      "room_builder"
    );
    const interiorsTileset = map.addTilesetImage(
      "Interiors_free_16x16",
      "interiors"
    );

    let collisionLayer = map.createLayer(
      "Collision Layer",
      [roomBuilderTileset, interiorsTileset],
      0,
      0
    );

    map.createLayer(
      "Tile Layer 1",
      [roomBuilderTileset, interiorsTileset],
      0,
      0
    );

    map.createLayer(
      "Tile Layer 2",
      [roomBuilderTileset, interiorsTileset],
      0,
      0
    );
    map.createLayer(
      "Tile Layer 3",
      [roomBuilderTileset, interiorsTileset],
      0,
      0
    );
    map.createLayer(
      "Tile Layer 4",
      [roomBuilderTileset, interiorsTileset],
      0,
      0
    );

    this.cameras.main.scrollX = (-window.innerWidth / 2) + map.widthInPixels/2;
    this.cameras.main.scrollY = (-window.innerHeight / 2) + map.heightInPixels/2;

    player = this.physics.add.sprite(250, 150, "playerSpritesheet");
    player.setCircle(1, 8, 22);

    console.log(player)


    this.physics.add.collider(player, collisionLayer);
    collisionLayer.setCollisionBetween(0, 1000);

    this.anims.create({
      key: "walkRight",
      frames: this.anims.generateFrameNumbers("playerSpritesheet", { start: 48, end: 53 }),
      frameRate: 10,
    });

    this.anims.create({
      key: "walkUp",
      frames: this.anims.generateFrameNumbers("playerSpritesheet", { start: 54, end: 59 }),
      frameRate: 10,
    });

    this.anims.create({
      key: "walkLeft",
      frames: this.anims.generateFrameNumbers("playerSpritesheet", { start: 60, end: 65 }),
      frameRate: 10,
    });

    this.anims.create({
      key: "walkDown",
      frames: this.anims.generateFrameNumbers("playerSpritesheet", { start: 66, end: 71 }),
      frameRate: 10,
    });

    this.anims.create({
      key: "standRight",
      frames: [{ key: "playerSpritesheet", frame: 0 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "standUp",
      frames: [{ key: "playerSpritesheet", frame: 1 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "standLeft",
      frames: [{ key: "playerSpritesheet", frame: 2 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "standDown",
      frames: [{ key: "playerSpritesheet", frame: 3 }],
      frameRate: 20,
    });
  }

  update() {
    player.setVelocityX(0);
    player.setVelocityY(0);
    let walkDistance = 80;

    if (cursors.left.isDown) {
      player.setVelocityX(-walkDistance);
      walkDirection = "Left";
      player.anims.play("walkLeft", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(walkDistance);
      walkDirection = "Right";
      player.anims.play("walkRight", true);
    } else if (cursors.up.isDown) {
      player.setVelocityY(-walkDistance);
      walkDirection = "Up";
      player.anims.play("walkUp", true);
    } else if (cursors.down.isDown) {
      player.setVelocityY(walkDistance);
      walkDirection = "Down";
      player.anims.play("walkDown", true);
    } else {
      player.anims.play("stand" + walkDirection, true);
    }
  }
}
