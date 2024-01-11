export class Ship {
  constructor(length, name) {
    if (isNaN(Number(length))) {
      throw new Error('Length argument must be a number');
    }
    this.length = Number(length);
    this.name = name;
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
