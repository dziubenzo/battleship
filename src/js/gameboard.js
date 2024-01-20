import { Ship } from './ship';

export class Gameboard {
  #boardSize = 10;
  #board = this.#createBoard();
  ships = [];
  hits = [];
  misses = [];

  constructor() {
    if (arguments.length > 0) {
      throw new Error('Gameboard is instantiated without any arguments');
    }
  }

  // Create a 2D array of size boardSize x boardSize
  #createBoard() {
    const board = [];
    for (let i = 0; i < this.#boardSize; i++) {
      board[i] = [];
      for (let j = 0; j < this.#boardSize; j++) {
        board[i][j] = null;
      }
    }
    return board;
  }

  // Make sure that the square is not adjacent to any ship and is empty
  #checkAdjacencyAndOverlapping(square) {
    if (square === 'unavailable') {
      throw new Error('Invalid ship placement: Ships cannot be adjacent');
    }
    if (typeof square === 'string' && square !== 'unavailable') {
      throw new Error('Invalid ship placement: Ships cannot overlap');
    }
  }

  // Check if the ship fits
  #checkSpace(ship, row, column, direction) {
    if (direction === 'horizontal') {
      const sumHorizontal = column - 1 + ship.length;
      if (sumHorizontal >= this.#boardSize) {
        throw new Error('Invalid ship placement: Ship does not fit');
      }
    } else if (direction === 'vertical') {
      const sumVertical = row - 1 + ship.length;
      if (sumVertical >= this.#boardSize) {
        throw new Error('Invalid ship placement: Ship does not fit');
      }
    }
  }

  // Make all legal squares adjacent to a ship unavailable
  #makeUnavailable(shipArray) {
    // Define all adjacent square combinations, starting from the top one and going clockwise
    const adjacentSquares = [
      [-1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
    ];
    for (const shipSquare of shipArray) {
      for (const adjacentSquare of adjacentSquares) {
        let row = shipSquare[0] + adjacentSquare[0];
        let column = shipSquare[1] + adjacentSquare[1];
        // Omit any illegal squares
        if (
          row < 0 ||
          row > this.#boardSize - 1 ||
          column < 0 ||
          column > this.#boardSize - 1
        ) {
          continue;
        }
        // Make legal square unavailable if it is not the ship itself
        if (this.#board[row][column] === null) {
          this.#board[row][column] = 'unavailable';
        }
      }
    }
  }

  // Check for attacks targeting squares that have already been attacked
  #checkDuplicates(row, column) {
    if (
      this.hits.find((hit) => row === hit[0] && column === hit[1]) ||
      this.misses.find((miss) => row === miss[0] && column === miss[1])
    ) {
      throw new Error('Invalid attack');
    }
  }

  // Get random integer between min and max, max is exclusive
  #getRandomInt(min, max) {
    return Math.floor(Math.random() * (min - max) + max);
  }

  // Get random direction
  #getRandomDirection() {
    const randomNumber = Math.random();
    if (randomNumber < 0.5) {
      return 'horizontal';
    }
    return 'vertical';
  }

  // Find ship that has been hit
  #findShip(shipName) {
    return this.ships.find((targetShip) => targetShip.name === shipName);
  }

  // Check the board square if it exists
  // Return the value of the legal board square
  getSquare(row, column) {
    if (arguments.length !== 2) {
      throw new Error('Invalid arguments');
    }
    if (isNaN(row) || row === null || isNaN(column) || column === null) {
      throw new Error(
        'Row and column arguments must be string numbers or numbers',
      );
    }
    const convertedRow = Number(row);
    const convertedColumn = Number(column);
    if (
      convertedRow < 0 ||
      convertedRow > this.#boardSize - 1 ||
      convertedColumn < 0 ||
      convertedColumn > this.#boardSize - 1
    ) {
      throw new Error('Board square does not exist');
    }
    return this.#board[convertedRow][convertedColumn];
  }

  // Place ship on the board
  placeShip(ship, row, column, direction) {
    if (arguments.length !== 4) {
      throw new Error('Invalid arguments');
    }
    if (!(ship instanceof Ship)) {
      throw new Error('The first argument must be an instance of Ship class');
    }
    if (direction !== 'horizontal' && direction !== 'vertical') {
      throw new Error("Direction argument must be 'horizontal' or 'vertical'");
    }
    // Check if the starting square is legal
    this.getSquare(row, column);
    // Check if the ship would fit
    this.#checkSpace(ship, row, column, direction);
    // Check all squares for adjacency and overlapping
    for (let i = 0; i < ship.length; i++) {
      if (direction === 'horizontal') {
        this.#checkAdjacencyAndOverlapping(this.#board[row][column + i]);
      } else if (direction === 'vertical') {
        this.#checkAdjacencyAndOverlapping(this.#board[row + i][column]);
      }
    }
    let shipCoordinates = [];
    // Place ship and push its coordinates
    for (let i = 0; i < ship.length; i++) {
      if (direction === 'horizontal') {
        this.#board[row][column + i] = ship.name;
        shipCoordinates.push([row, column + i]);
      } else if (direction === 'vertical') {
        this.#board[row + i][column] = ship.name;
        shipCoordinates.push([row + i, column]);
      }
    }
    // Store ship in array
    this.ships.push(ship);
    this.#makeUnavailable(shipCoordinates);
  }

  // Place all ships randomly
  // Return their starting coordinates and direction
  placeShipsRandomly(ships) {
    if (arguments.length !== 1) {
      throw new Error('Invalid arguments');
    }
    if (!Array.isArray(ships)) {
      throw new Error('Argument must be an array');
    }
    if (ships.length === 0) {
      throw new Error('Array is empty');
    }
    // Make sure the array has length and name properties
    for (const ship of ships) {
      if (ship.length === undefined || ship.name === undefined) {
        throw new Error('Invalid array');
      }
    }
    // Clear the board and ships
    this.#board = this.#createBoard();
    this.ships = [];

    const coordinates = [];
    for (const ship of ships) {
      // Find valid combination the brute force way
      while (true) {
        try {
          const row = this.#getRandomInt(0, 10);
          const column = this.#getRandomInt(0, 10);
          const direction = this.#getRandomDirection();
          this.placeShip(
            new Ship(ship.length, ship.name),
            row,
            column,
            direction,
          );
          coordinates.push({ row, column, direction });
          break;
        } catch {
          continue;
        }
      }
    }
    return coordinates;
  }

  // Process attack accordingly
  receiveAttack(row, column) {
    if (arguments.length !== 2) {
      throw new Error('Invalid arguments');
    }
    const square = this.getSquare(row, column);
    this.#checkDuplicates(row, column);
    // Handle misses
    if (square === null || square === 'unavailable') {
      this.misses.push([row, column]);
      return;
    }
    // Handle hits
    const targetShip = this.#findShip(square);
    targetShip.hit();
    this.hits.push([row, column]);
    this.areAllShipsDown();
  }

  // Return true if the previous attack was a hit
  // Return false otherwise
  isAHit(row, column) {
    if (arguments.length !== 2) {
      throw new Error('Invalid arguments');
    }
    const square = this.getSquare(row, column);
    if (square === null || square === 'unavailable') {
      return false;
    }
    const previousHitRow = this.hits[this.hits.length - 1][0];
    const previousHitColumn = this.hits[this.hits.length - 1][1];
    if (previousHitRow === row && previousHitColumn === column) {
      return true;
    }
    return false;
  }

  // Check if all ships have been sunk
  areAllShipsDown() {
    if (this.ships.every((ship) => ship.isSunk())) {
      return true;
    }
    return false;
  }
}
