import EventEmitter from './eventEmmiter.js';
import {
  PLAYFIELD, BOM, START_GRENADE_POSITION_Y, SPEED_GRENADE, START_POSITION_PLAYER,
} from './variables.js';
import randomInteger from './utilities.js';

export default class View extends EventEmitter {
  constructor(model) {
    super();
    this.model = model;

    this.selector = (item) => document.querySelector(item);
    this.id = (item) => document.getElementById(item);

    this.on('drawField', () => this.drawField());
    this.on('drawPlayer', () => this.drawPlayer());
  }

  renderGrenade() {
    return new Promise((resolve) => {
      let canBreak = false;

      for (let y = PLAYFIELD.length - 1; y >= 0; y--) {
        const line = PLAYFIELD[y];

        if (canBreak) {
          break;
        }

        // eslint-disable-next-line no-loop-func
        line.forEach((grenade, x) => {
          const id = `${y}${x}`;
          const newId = `${y - 1}${x}`;
          const elem = this.id(id);
          const nextElem = this.id(newId);

          if (elem.classList.contains('grenade') && elem.classList.contains('zombie')) {
            canBreak = true;

            resolve(['boom', y, x]);
          }

          if (elem.classList.contains('grenade')) {
            if (+newId >= 0) {
              canBreak = true;

              setTimeout(() => {
                resolve(['restart', elem, nextElem]);
              }, SPEED_GRENADE);
            } else {
              canBreak = 1;

              resolve(['rage', elem, newId]);
            }
          }
        });
      }
    });
  }

  boom(y, x) {
    const id = `${y}${x}`;

    this.id(id).classList.remove('grenade');
    BOM.play();

    for (let i = y - 2; i <= y + 2; i++) {
      const arrayOfContact = PLAYFIELD[i];

      if (arrayOfContact) {
        for (let j = x - 2; j <= x + 2; j++) {
          const numberOfCell = `${i}${j}`;

          if (
            arrayOfContact[j] === 0
            && this.id(numberOfCell).classList.contains('zombie')
          ) {
            this.model.score();
            this.model.levelUp();
            this.id(numberOfCell).classList.remove('zombie');
          }
        }
      }
    }
  }

  async viewGrenade() {
    const [result, elem, nextElem] = await this.renderGrenade();

    if (result === 'restart') {
      elem.classList.remove('grenade');
      nextElem.classList.add('grenade');

      this.viewGrenade();
    }

    if (result === 'rage') {
      elem.classList.remove('grenade');

      this.rageZombie();
    }

    if (result === 'boom') {
      this.boom(elem, nextElem);
    }
  }

  killZombie(cellId) {
    if (
      this.id(cellId).classList.contains('bullet')
      && this.id(cellId).classList.contains('zombie')
    ) {
      this.id(cellId).classList.remove('bullet');
      this.id(cellId).classList.remove('zombie');

      this.model.score();
      this.model.upSpeed();
    }

    return null;
  }

  gameOver() {
    this.model.helper.turnOn = false;

    const gameOver = document.createElement('div');
    const textGameOver = document.createElement('div');
    const container = document.createElement('div');

    container.id = 'info-container';

    textGameOver.textContent = 'GAME OVER';
    textGameOver.classList.add('game_over-text');

    gameOver.classList.add('game_over-background');

    container.append(textGameOver);
    container.append(gameOver);

    this.id('wrapper').append(container);

    return null;
  }

  rageZombie() {
    for (let y = PLAYFIELD.length - 1; y >= 0; y--) {
      for (let x = 0; x < PLAYFIELD[y].length; x++) {
        const id = `${y}${x}`;

        if (this.id(id).classList.contains('zombie')) {
          const cellId = `${y}${x}`;
          const newCellId = `${y + 1}${x}`;

          if (y + 1 !== PLAYFIELD.length - 1) {
            this.id(cellId).classList.remove('zombie');
            this.id(newCellId).classList.add('zombie');
          } else {
            this.gameOver();
          }
        }
      }
    }
  }

  bullet() {
    this.methodForEach('bullet');

    for (let y = PLAYFIELD.length - 1; y >= 0; y--) {
      for (let x = 0; x < PLAYFIELD[y].length; x++) {
        const id = `${y}${x}`;

        if (this.id(id).classList.contains('bullet')) {
          const cellId = `${y - 1}${x}`;

          if (y - 1 < 0) {
            this.id(id).classList.remove('bullet');
            this.rageZombie();

            return null;
          }
          this.id(cellId).classList.add('bullet');
          this.id(id).classList.remove('bullet');
          this.killZombie(cellId);
        }
      }
    }

    return null;
  }

  renderZombie(randomZombie) {
    const id = `${0}${randomZombie}`;

    this.id(id).classList.add('zombie');
  }

  setRandomZombie() {
    const randomZombieNumber = randomInteger(2, 5);

    for (let i = 0; i < randomZombieNumber; i++) {
      const randomNumber = Math.ceil((Math.random() * 7) - 1);

      this.renderZombie(randomNumber);
    }
  }

  drawField() {
    const placeField = PLAYFIELD;
    const getCell = (y, x) => {
      const cellElem = document.createElement('div');

      cellElem.classList.add('cell');
      cellElem.id = `${y}${x}`;

      return cellElem;
    };

    placeField.forEach((line, y) => {
      const wrappForCell = document.createElement('div');

      wrappForCell.id = `str-${y}`;
      wrappForCell.classList.add('wrapper_cell');

      line.forEach((item, x) => {
        const cell = getCell(y, x);

        wrappForCell.appendChild(cell);
      });

      this.selector('.board').appendChild(wrappForCell);
    });
  }

  drawStats() {
    this.id('level').innerText = this.model.level;
    this.id('score').innerText = this.model.point;
    this.id('grenade').innerText = 'no complited';
  }

  methodForEach(string) {
    const arrayFromNode = document.getElementById('str-14').children;

    if (string === 'player') {
      Array.prototype.forEach.call(arrayFromNode, (item) => {
        item.classList.remove('player');
      });

      return null;
    }

    if (string === 'bullet') {
      Array.prototype.forEach.call(arrayFromNode, (item, i) => {
        if (item.classList.contains('player')) {
          const id = `${START_POSITION_PLAYER}${i}`;

          this.id(id).classList.add('bullet');
        }
      });

      return null;
    }

    if (string === 'grenade') {
      Array.prototype.forEach.call(arrayFromNode, (item, i) => {
        if (item.classList.contains('player')) {
          const id = `${START_GRENADE_POSITION_Y}${i}`;

          this.id(id).classList.add('grenade');
        }
      });

      return null;
    }

    return null;
  }

  drawPlayer() {
    this.methodForEach('player');

    const position = `${START_POSITION_PLAYER}${this.model.playerPosition.x}`;

    this.id(position).classList.add('player');
  }
}
