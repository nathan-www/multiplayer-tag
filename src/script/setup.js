function preloadSetup(game) {
  // Load tilesheets, tilemaps and spritesheets
  game.load.image("room_builder", "src/assets/Room_Builder_free_16x16.png");
  game.load.image("interiors", "src/assets/Interiors_free_16x16.png");
  game.load.tilemapTiledJSON("tilemap", "src/assets/room.json");

  game.load.spritesheet("playerSpritesheet", "src/assets/Adam_16x16.png", {
    frameWidth: 16,
    frameHeight: 32,
  });
}

function createSetup(game) {
  //Setup map and layers
  const map = game.make.tilemap({ key: "tilemap" });
  const roomBuilderTileset = map.addTilesetImage(
    "Room_Builder_free_16x16",
    "room_builder"
  );
  const interiorsTileset = map.addTilesetImage(
    "Interiors_free_16x16",
    "interiors"
  );

  game.collisionLayer = map.createLayer(
    "Collision Layer",
    [roomBuilderTileset, interiorsTileset],
    0,
    0
  );
  game.collisionLayer.setCollisionBetween(0, 1000);

  map.createLayer("Tile Layer 1", [roomBuilderTileset, interiorsTileset], 0, 0);
  map.createLayer("Tile Layer 2", [roomBuilderTileset, interiorsTileset], 0, 0);
  map.createLayer("Tile Layer 3", [roomBuilderTileset, interiorsTileset], 0, 0);
  map.createLayer("Tile Layer 4", [roomBuilderTileset, interiorsTileset], 0, 0);

  //Scroll map into center of window
  game.cameras.main.scrollX = (-window.innerWidth / 2) + map.widthInPixels/2;
  game.cameras.main.scrollY = (-window.innerHeight / 2) + map.heightInPixels/2;

  //Add sprite animations
  game.anims.create({
    key: "walkRight",
    frames: game.anims.generateFrameNumbers("playerSpritesheet", { start: 48, end: 53 }),
    frameRate: 10,
    repeat: -1
  });

  game.anims.create({
    key: "walkUp",
    frames: game.anims.generateFrameNumbers("playerSpritesheet", { start: 54, end: 59 }),
    frameRate: 10,
    repeat: -1
  });

  game.anims.create({
    key: "walkLeft",
    frames: game.anims.generateFrameNumbers("playerSpritesheet", { start: 60, end: 65 }),
    frameRate: 10,
    repeat: -1
  });

  game.anims.create({
    key: "walkDown",
    frames: game.anims.generateFrameNumbers("playerSpritesheet", { start: 66, end: 71 }),
    frameRate: 10,
    repeat: -1
  });

  game.anims.create({
    key: "standRight",
    frames: [{ key: "playerSpritesheet", frame: 0 }],
    frameRate: 20,
  });

  game.anims.create({
    key: "standUp",
    frames: [{ key: "playerSpritesheet", frame: 1 }],
    frameRate: 20,
  });

  game.anims.create({
    key: "standLeft",
    frames: [{ key: "playerSpritesheet", frame: 2 }],
    frameRate: 20,
  });

  game.anims.create({
    key: "standDown",
    frames: [{ key: "playerSpritesheet", frame: 3 }],
    frameRate: 20,
  });
}

export { preloadSetup, createSetup };
