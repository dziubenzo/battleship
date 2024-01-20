import { Gameboard } from './gameboard';

export class Player {
  constructor(name) {
    if (!name) {
      name = 'Player';
    }
    this.name = String(name);
    this.board = new Gameboard();
    this.isHuman = true;
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
  #previousAttackHit = false;

  constructor(isSmart = false) {
    super();
    if (isSmart !== false && isSmart !== true) {
      throw new Error('Invalid argument');
    }
    this.name = 'Computer';
    this.isSmart = isSmart;
    this.isHuman = false;
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

  // Get random integer between min and max, max is exclusive
  #getRandomInt(min, max) {
    return Math.floor(Math.random() * (min - max) + max);
  }

  // Attack the enemy's board randomly
  // If the computer player is a smarter one, attack a horizontally or vertically adjacent square after getting a hit
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
    const oldHitsCount = enemy.board.hits.length;
    let row = 0;
    let column = 0;
    if (!this.#previousAttackHit) {
      do {
        row = this.#getRandomInt(0, 10);
        column = this.#getRandomInt(0, 10);
      } while (this.#isDuplicate(enemy, row, column));
    } else {
      const fourAdjacentSquares = [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1],
      ];
      // Make sure at least one legal move can be made to prevent an infinite loop
      let checkPassed = false;
      for (const square of fourAdjacentSquares) {
        row = enemy.board.hits[enemy.board.hits.length - 1][0] + square[0];
        column = enemy.board.hits[enemy.board.hits.length - 1][1] + square[1];
        if (
          !this.#isDuplicate(enemy, row, column) &&
          row >= 0 &&
          row <= 9 &&
          column >= 0 &&
          column <= 9
        ) {
          checkPassed = true;
          break;
        }
      }
      // Choose one of the four adjacent moves if check passed
      // Otherwise make a random move
      if (checkPassed) {
        do {
          const combination = fourAdjacentSquares[this.#getRandomInt(0, 4)];
          row =
            enemy.board.hits[enemy.board.hits.length - 1][0] + combination[0];
          column =
            enemy.board.hits[enemy.board.hits.length - 1][1] + combination[1];
        } while (
          this.#isDuplicate(enemy, row, column) ||
          row < 0 ||
          row > 9 ||
          column < 0 ||
          column > 9
        );
      } else {
        do {
          row = this.#getRandomInt(0, 10);
          column = this.#getRandomInt(0, 10);
        } while (this.#isDuplicate(enemy, row, column));
      }
    }
    enemy.board.receiveAttack(row, column);
    const newHitsCount = enemy.board.hits.length;
    // Remember a hit if computer is a smarter one
    if (newHitsCount > oldHitsCount && this.isSmart) {
      this.#previousAttackHit = true;
      return [row, column];
    }
    this.#previousAttackHit = false;
    // Return attacked square coordinates
    return [row, column];
  }
}
