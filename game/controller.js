import EventEmitter from './eventEmmiter.js';
import Model from './model.js';
import View from './view.js';
import {
  PLAYFIELD,
  DEFAULT_LEVEL,
  DEFAULT_POINT,
  LEFT_ARROW,
  RIGHT_ARROW,
  ARROW_UP_GRENADE,
  RESTART,
  SPACE_FIRE,
  FIRE_AUDIO,
  TRAKTOR,
  FINAL_LINE,
  MUSIC_VOLUME,
  DEFAULT_PLAYER_POSITION_X,
  KEYS_SET,
} from './variables.js';

const modelObject = new Model();
const viewObject = new View(modelObject);

const button = document.getElementById('start');

class Controller extends EventEmitter {
  constructor(model, view) {
    super();
    this.model = model;
    this.view = view;
  }

  grenade() {
    this.model.statusGrenade();
  }

  movingDown() {
    for (let y = PLAYFIELD.length - 1; y >= 0; y--) {
      for (let x = 0; x < PLAYFIELD[y].length; x++) {
        const cellId = `${y}${x}`;
        const lastStr = `${FINAL_LINE}${x}`;

        if (this.model.id(cellId).classList.contains('zombie')) {
          const newCellId = `${y + 1}${x}`;
          this.model.id(cellId).classList.remove('zombie');
          this.model.id(newCellId).classList.add('zombie');
        }

        if (this.model.id(lastStr).classList.contains('zombie')) {
          this.model.helper.turnOn = false;
        }
      }
    }

    this.startGame();
  }

  turnOn() {
    this.model.helper.turnOn = true;
  }

  startGame() {
    if (!this.model.helper.turnOn) {
      this.view.gameOver();
    } else {
      this.view.setRandomZombie();

      setTimeout(
        () => {
          this.movingDown();
        },
        this.model.gameSpeed,
      );
    }
  }

  restartGame() {
    this.model.level = DEFAULT_LEVEL;
    this.model.point = DEFAULT_POINT;
    this.model.playerPosition.x = DEFAULT_PLAYER_POSITION_X;
    this.view.drawStats();

    while (this.view.selector('.board').lastChild) {
      this.view.selector('.board').lastChild.remove();
    }

    this.view.id('info-container').remove();

    this.emit('drawField');
    this.emit('drawPlayer');

    // eslint-disable-next-line no-use-before-define
    button.addEventListener('click', startGame);
  }
}
const controller = new Controller(modelObject, viewObject);

const mapsFunctions = {
  leftRight: (keyCode) => { controller.model.playerMotion(keyCode); },
  drawField: () => { controller.view.emit('drawField'); },
  drawPlayer: () => { controller.view.emit('drawPlayer'); },
  restart: () => { controller.restartGame(); },
  statusGrenade: () => { controller.model.statusGrenade(); },
  forEach: () => { controller.view.methodForEach('grenade'); },
  viewGrenade: () => { controller.view.viewGrenade(); },
  bullet: () => { controller.view.bullet(); },
  drawStats: () => { controller.view.drawStats(); },
};

KEYS_SET.forEach((key) => {
  controller.on(key, mapsFunctions[key]);
});

const startGame = () => {
  controller.turnOn();
  controller.grenade();
  controller.startGame();

  TRAKTOR.play();
  TRAKTOR.volume = MUSIC_VOLUME;

  button.removeEventListener('click', startGame);
};

button.addEventListener('click', startGame);

controller.emit('drawField');
controller.emit('drawPlayer');
controller.emit('drawStats');

window.addEventListener('keyup', (e) => {
  if (controller.model.helper.turnOn) {
    if (e.keyCode === LEFT_ARROW || e.keyCode === RIGHT_ARROW) {
      controller.emit('leftRight', e.keyCode);
      controller.emit('drawPlayer');
    }

    if (e.keyCode === SPACE_FIRE) {
      FIRE_AUDIO.play();

      controller.emit('bullet');
    }

    if (e.keyCode === ARROW_UP_GRENADE) {
      if (controller.model.helper.grenadeComplete) {
        controller.model.helper.grenadeComplete = false;

        controller.emit('statusGrenade');
        controller.emit('forEach');
        controller.emit('viewGrenade');
      }
    }
  }

  if (!controller.model.helper.turnOn) {
    if (e.keyCode === RESTART) {
      controller.emit('restart');
    }
  }
});
