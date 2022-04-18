import EventEmitter from './eventEmmiter.js';
import {
  SPEED,
  ACHIVEMENT,
  DEFAULT_LEVEL,
  DEFAULT_POINT,
  PLAYER_POSITION,
  HELPER,
  LEVELUP_POINT,
  TIME_GRENADE_COMPLITE,
  GAME_SPEED_PERCENT,
  MAX_CELL,
  MIN_CELL,
  LEFT_ARROW,
  RIGHT_ARROW,
} from './variables.js';

export default class Model extends EventEmitter {
  constructor() {
    super();
    this.gameSpeed = SPEED;
    this.level = DEFAULT_LEVEL;
    this.point = DEFAULT_POINT;
    this.playerPosition = PLAYER_POSITION;
    this.helper = HELPER;

    this.id = (item) => document.getElementById(item);
  }

  score() {
    this.point += 1;
    this.id('score').innerText = this.point;
  }

  levelUp() {
    if (Number.isInteger(this.point / LEVELUP_POINT)) {
      ACHIVEMENT.play();
      this.level += 1;
      this.id('level').innerText = this.level;
    }

    return null;
  }

  upSpeed() {
    if (Number.isInteger(this.point / LEVELUP_POINT)) {
      this.gameSpeed -= (this.gameSpeed * GAME_SPEED_PERCENT);
      this.levelUp();
    }
  }

  statusGrenade() {
    this.id('grenade').innerText = ' you can not use';
    this.id('load').style.display = 'inline-block';
    setTimeout(() => {
      this.helper.grenadeComplete = true;
      this.id('load').style.display = 'none';
      this.id('grenade').innerText = ' make booooom!!!!!!!';
    }, TIME_GRENADE_COMPLITE);
  }

  moving(direction) {
    const count = this.playerPosition.x + direction;

    if (count > MAX_CELL) {
      this.playerPosition.x = MIN_CELL;

      return null;
    }

    if (count < MIN_CELL) {
      this.playerPosition.x = MAX_CELL;

      return null;
    }

    this.playerPosition.x = count;

    return null;
  }

  playerMotion(keyCode) {
    if (keyCode === LEFT_ARROW) {
      this.moving(-1);
    }

    if (keyCode === RIGHT_ARROW) {
      this.moving(1);
    }
  }
}
