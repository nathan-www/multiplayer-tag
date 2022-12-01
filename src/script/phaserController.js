import Phaser from "phaser";
import { preloadSetup, createSetup } from "./setup";

let phaserInstance;
let gameLoadedResolver;

let game = {
  loaded: new Promise((res, rej) => {
    gameLoadedResolver = res;
  }).then((scene) => {
    game.game = phaserInstance;
    game.scene = scene;
  }),
  game: null,
  scene: null
};
let cursors;

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

  phaserInstance = new Phaser.Game(config);
});

class GameScene extends Phaser.Scene {
  constructor() {
    super("gameScene");
  }

  preload() {
    cursors = this.input.keyboard.createCursorKeys();
    preloadSetup(this);
  }

  create() {
    createSetup(this);
    gameLoadedResolver(this);
  }

  update() {
  }
}

export { game };
