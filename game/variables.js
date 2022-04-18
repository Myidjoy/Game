const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const SPACE_FIRE = 32;
const ARROW_UP_GRENADE = 38;
const RESTART = 13;

const PLAYFIELD = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];
const PLAYER_POSITION = {
  x: 3,
  y: 14,
};
const HELPER = {
  grenadeComplete: false,
  turnOn: false,
};

const MAX_CELL = PLAYFIELD[PLAYFIELD.length - 1].length - 1;
const MIN_CELL = PLAYFIELD[PLAYFIELD.length - 1].length - PLAYFIELD[PLAYFIELD.length - 1].length;

const ACHIVEMENT = new Audio('./audio/sound_Achievement.mp3');
const BOM = new Audio('./audio/Без названия.mov');
const FIRE_AUDIO = new Audio('./audio/105.mov');
const TRAKTOR = new Audio('./audio/edet-traktor-po-polyam.mp3');

const DEFAULT_LEVEL = 1;
const DEFAULT_POINT = 0;
const SPEED = 1000;
const SPEED_GRENADE = 100;
const LEVELUP_POINT = 100;
const TIME_GRENADE_COMPLITE = 10000;
const GAME_SPEED_PERCENT = 0.1;
const START_GRENADE_POSITION_Y = 13;
const START_POSITION_PLAYER = 14;
const MUSIC_VOLUME = 0.1;
const DEFAULT_PLAYER_POSITION_X = 3;
const FINAL_LINE = 14;
const KEYS_SET = ['leftRight', 'drawField', 'drawPlayer', 'restart', 'statusGrenade', 'forEach', 'viewGrenade', 'bullet', 'drawStats'];

export {
  KEYS_SET,
  FINAL_LINE,
  DEFAULT_PLAYER_POSITION_X,
  MUSIC_VOLUME,
  START_POSITION_PLAYER,
  SPEED_GRENADE,
  START_GRENADE_POSITION_Y,
  TRAKTOR,
  FIRE_AUDIO,
  LEFT_ARROW,
  RIGHT_ARROW,
  SPACE_FIRE,
  ARROW_UP_GRENADE,
  SPEED, PLAYFIELD,
  ACHIVEMENT,
  DEFAULT_LEVEL,
  DEFAULT_POINT,
  PLAYER_POSITION,
  HELPER,
  BOM,
  LEVELUP_POINT,
  TIME_GRENADE_COMPLITE,
  GAME_SPEED_PERCENT,
  MAX_CELL,
  MIN_CELL,
  RESTART,
};
