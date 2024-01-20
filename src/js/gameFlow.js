import { Player, ComputerPlayer } from './player';
import {
  showShipPlacementModal,
  placeShips,
  showPlacedShip,
} from './DOM.modals';
import { getPlayerBoard } from './DOM';
import { COMPUTER_MOVE_DURATION } from './main';

export let player1;
export let player2;

const ships = [
  {
    length: 4,
    name: 'Test1',
  },
  {
    length: 3,
    name: 'Test2',
  },
  {
    length: 2,
    name: 'Test3',
  },
  {
    length: 1,
    name: 'Test4',
  },
];

// Create appropriate players based on player selections
export function createPlayers(formData) {
  if (formData['player-1'] === 'human') {
    player1 = new Player(formData['player-1-name']);
  } else if (formData['player-1'] === 'computer') {
    player1 = new ComputerPlayer();
  } else {
    player1 = new ComputerPlayer(true);
  }

  if (formData['player-2'] === 'human') {
    player2 = new Player(formData['player-2-name']);
  } else if (formData['player-2'] === 'computer') {
    player2 = new ComputerPlayer();
  } else {
    player2 = new ComputerPlayer(true);
  }

  if (player1.isHuman && player2.isHuman) {
    // TO BE IMPLEMENTED
    return;
  }
  if (!player1.isHuman && !player2.isHuman) {
    playGame();
  }
  if (player1.isHuman) {
    showShipPlacementModal();
    placeShips(player1, ships, ships[0], placeShips);
  } else if (player2.isHuman) {
    showShipPlacementModal();
    placeShips(player2, ships, ships[0], placeShips);
  }
}

// Play the game until either player's ships are all sunk
export function playGame() {
  // End game is all ships have been sunk
  function isGameOver() {
    if (player1.board.areAllShipsDown() || player2.board.areAllShipsDown()) {
      return true;
    }
    return false;
  }

  // Play computer turn
  function playComputerTurn(attacker, enemy, enemyBoard) {
    setTimeout(() => {
      const coordinates = attacker.attack(enemy);
      const row = coordinates[0];
      const column = coordinates[1];
      const boardSquare = enemyBoard.querySelector(
        `div[data-row="${row}"][data-column="${column}"]`,
      );
      if (enemy.board.isAHit(row, column)) {
        boardSquare.classList.add('hit');
        // const shipName = enemy.board.getSquare(row, column);
        // const ship = enemy.board.findShip(shipName);
        // if (ship.isSunk()) {
        //   console.log(ship.name);
        // }
      } else {
        boardSquare.classList.add('miss');
      }
      turn++;
      if (attacker === player1) {
        player1Turn = false;
        player2Turn = true;
      } else {
        player1Turn = true;
        player2Turn = false;
      }
      playTurn();
    }, COMPUTER_MOVE_DURATION);
  }

  // Check if the clicked square is a valid one for attack
  function isValidSquare(event) {
    if (
      event.target.classList.contains('header') ||
      event.target.classList.contains('hit') ||
      event.target.classList.contains('miss') ||
      event.button === 1 ||
      event.button === 2
    ) {
      return false;
    }
    return true;
  }

  // Play human turn
  function playHumanTurn(event, attacker, enemy, enemyBoard) {
    const row = event.target.dataset.row;
    const column = event.target.dataset.column;
    const boardSquare = enemyBoard.querySelector(
      `div[data-row="${row}"][data-column="${column}"]`,
    );
    attacker.attack(enemy, row, column);
    if (enemy.board.isAHit(row, column)) {
      boardSquare.classList.add('hit');
    } else {
      boardSquare.classList.add('miss');
    }
  }

  // Event handler for playHumanTurn function attacking Player 2
  function attackPlayer2() {
    if (!isValidSquare(event)) {
      return;
    }
    playHumanTurn(event, player1, player2, player2Board);
    turn++;
    player1Turn = false;
    player2Turn = true;
    player2Board.removeEventListener('mousedown', attackPlayer2);
    playTurn();
  }

  // Event handler for playHumanTurn function attacking Player 1
  function attackPlayer1() {
    if (!isValidSquare(event)) {
      return;
    }
    playHumanTurn(event, player2, player1, player1Board);
    turn++;
    player1Turn = true;
    player2Turn = false;
    player1Board.removeEventListener('mousedown', attackPlayer1);
    playTurn();
  }

  // Play a turn
  function playTurn() {
    if (isGameOver()) {
      console.log('GG');
      return;
    }
    if (player1Turn && !player1.isHuman) {
      playComputerTurn(player1, player2, player2Board);
    } else if (player1Turn && player1.isHuman) {
      player2Board.addEventListener('mousedown', attackPlayer2);
    } else if (player2Turn && !player2.isHuman) {
      playComputerTurn(player2, player1, player1Board);
    } else if (player2Turn && player2.isHuman) {
      player1Board.addEventListener('mousedown', attackPlayer1);
    }
  }

  const player1Board = getPlayerBoard(player1);
  const player2Board = getPlayerBoard(player2);
  let player1Turn = true;
  let player2Turn = false;
  let turn = 1;

  // Place all computer ships randomly
  if (player1.isHuman && !player2.isHuman) {
    player2.board.placeShipsRandomly(ships);
  }
  if (player2.isHuman && !player1.isHuman) {
    player1.board.placeShipsRandomly(ships);
  }
  // In the computer vs computer scenario, show their ships on boards
  if (!player1.isHuman && !player2.isHuman) {
    const player1Ships = player1.board.placeShipsRandomly(ships);
    player1Ships.forEach((ship, index) => {
      showPlacedShip(
        ships[index],
        ship.row,
        ship.column,
        ship.direction,
        player1Board,
      );
    });
    const player2Ships = player2.board.placeShipsRandomly(ships);
    player2Ships.forEach((ship, index) => {
      showPlacedShip(
        ships[index],
        ship.row,
        ship.column,
        ship.direction,
        player2Board,
      );
    });
  }
  playTurn();
}
