import { Gameboard } from './gameboard';

export class Player {
  constructor(name = 'Player') {
    this.name = String(name);
    this.board = new Gameboard();
  }

  // Attack the enemy's board
  attack(enemy, row, column) {
    if (arguments.length !== 3) {
      throw new Error('Invalid arguments');
    }
    if (!(enemy instanceof Player)) {
      throw new Error('The first argument must be an instance of Player class');
    }
    if (this === enemy) {
      throw new Error('You cannot attack yourself');
    }
    enemy.board.receiveAttack(row, column);
  }
}

export class Computer extends Player {}
