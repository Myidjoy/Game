export default class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    this.events[event] = listener;

    return this;
  }

  emit(event, ...rest) {
    this.events[event](...rest);
  }
}
