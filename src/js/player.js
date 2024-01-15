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
    if (!(enemy instanceof Player) && !(enemy instanceof ComputerPlayer)) {
      throw new Error('The first argument must be an instance of Player/ComputerPlayer class');
    }
    if (this === enemy) {
      throw new Error('You cannot attack yourself');
    }
    enemy.board.receiveAttack(row, column);
  }
}

export class ComputerPlayer extends Player {
  constructor(isSmart = false) {
    super();
    if (isSmart !== false && isSmart !== true) {
      throw new Error('Invalid argument');
    }
    this.name = 'Computer';
    this.isSmart = isSmart;
  }
}
