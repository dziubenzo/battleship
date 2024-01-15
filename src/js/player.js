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
      throw new Error(
        'The first argument must be an instance of Player/ComputerPlayer class',
      );
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

  // Check for attacks targeting squares that have already been attacked
  #isDuplicate(enemy, row, column) {
    if (
      enemy.board.hits.find((hit) => row === hit[0] && column === hit[1]) ||
      enemy.board.misses.find((miss) => row === miss[0] && column === miss[1])
    ) {
      return true;
    }
    return false;
  }

  // Get random integer between 0 and 9, both inclusive (10x10 board)
  #getRandomInt() {
    return Math.floor(Math.random() * (0 - 10) + 10);
  }

  // Attack the enemy's board randomly
  attack(enemy) {
    if (arguments.length !== 1) {
      throw new Error('Invalid arguments');
    }
    if (!(enemy instanceof Player) && !(enemy instanceof ComputerPlayer)) {
      throw new Error(
        'The argument must be an instance of Player/ComputerPlayer class',
      );
    }
    if (this === enemy) {
      throw new Error('Computer cannot attack itself');
    }
    let row = 0;
    let column = 0;
    do {
      row = this.#getRandomInt();
      column = this.#getRandomInt();
    } while (this.#isDuplicate(enemy, row, column));
    enemy.board.receiveAttack(row, column);
  }
}
