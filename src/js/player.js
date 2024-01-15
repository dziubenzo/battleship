import { Gameboard } from './gameboard';

export class Player {
  constructor(name = 'Player') {
    this.name = String(name);
    this.board = new Gameboard();
  }
}
