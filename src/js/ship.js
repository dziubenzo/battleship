export class Ship {
  constructor(length, name) {
    if (isNaN(length) || length === null) {
      throw new Error('Length must be a number');
    }
    if (!Number.isInteger(Number(length))) {
      throw new Error('Length must be an integer');
    }
    if (length < 1 || length > 10) {
      throw new Error('Invalid length');
    }
    this.name = name;
    this.length = Number(length);
    this.hits = 0;
  }

  isSunk() {
    if (this.hits === this.length) {
      return true;
    }
    return false;
  }

  hit() {
    if (this.isSunk()) {
      throw new Error('The ship has already sunk!');
    }
    this.hits++;
  }
}
