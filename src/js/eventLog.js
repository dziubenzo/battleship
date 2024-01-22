import { Player } from './player';

export class EventLog {
  constructor(player1, player2) {
    if (arguments.length !== 2) {
      throw new Error('Invalid arguments');
    }
    if (!(player1 instanceof Player) || !(player2 instanceof Player)) {
      throw new Error(
        'Both arguments must be an instance of Player/ComputerPlayer class',
      );
    }
    this.player1 = player1;
    this.player2 = player2;
    this.moves = player1.attacks + player2.attacks;
  }

  // Get coordinates of board square
  getCoordinates(row, column) {
    if (arguments.length !== 2) {
      throw new Error('Invalid arguments');
    }
    const rowMap = {
      0: 'A',
      1: 'B',
      2: 'C',
      3: 'D',
      4: 'E',
      5: 'F',
      6: 'G',
      7: 'H',
      8: 'I',
      9: 'J',
    };
    const rowCoordinate = rowMap[row];
    const columnCoordinate = column + 1;
    return rowCoordinate + columnCoordinate;
  }

  // Update moves
  updateMoves() {
    this.moves = this.player1.attacks + this.player2.attacks;
  }
}
