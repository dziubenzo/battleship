export class Ship {
  constructor(length, name) {
    if (isNaN(Number(length))) {
      throw new Error('Length argument must be a number');
    }
    this.length = Number(length);
    this.name = name;
    this.hits = 0;
    this.isSunk = false;
  }
}
