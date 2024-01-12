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

  // Return the value of a legal board square
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
}
