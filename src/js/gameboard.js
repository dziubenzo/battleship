export class Gameboard {
  #boardSize = 10;
  #board = this.#createBoard();
  ships = [];
  hits = [];
  misses = [];

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

  // Find ship that has been hit
  #findShip(shipName) {
    return this.ships.find((targetShip) => targetShip.name === shipName);
  }

  // Check the board square if it exists
  // Return the value of the legal board square
  getSquare(row, column) {
    if (
      row < 0 ||
      row > this.#boardSize - 1 ||
      column < 0 ||
      column > this.#boardSize - 1
    ) {
      throw new Error('Board square does not exist');
    }
    return this.#board[row][column];
  }

  // Place ship on the board
  placeShip(ship, row, column, direction) {
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

  // Process attack accordingly
  receiveAttack(row, column) {
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
  }
}
