export class Gameboard {
  #boardSize = 10;
  #board = this.#createBoard();

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
    }
    if (direction === 'vertical') {
      const sumVertical = row - 1 + ship.length;
      if (sumVertical >= this.#boardSize) {
        throw new Error('Invalid ship placement: Ship does not fit');
      }
    }
  }

  // Return the value of the board square
  // Check the board square if it exists
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
    if (direction === 'horizontal') {
      for (let i = 0; i < ship.length; i++) {
        this.#checkAdjacencyAndOverlapping(this.#board[row][column + i]);
      }
    } else if (direction === 'vertical') {
      for (let i = 0; i < ship.length; i++) {
        this.#checkAdjacencyAndOverlapping(this.#board[row + i][column]);
      }
    }
    // Place ship
    if (direction === 'horizontal') {
      for (let i = 0; i < ship.length; i++) {
        this.#board[row][column + i] = ship.name;
      }
    } else if (direction === 'vertical') {
      for (let i = 0; i < ship.length; i++) {
        this.#board[row + i][column] = ship.name;
      }
    }
  }
}
