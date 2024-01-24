import { Player, ComputerPlayer } from './player';
import { EventLog } from './eventLog';
import {
  showShipPlacementModal,
  placeShips,
  showGameOverModal,
} from './DOM.modals';
import {
  getPlayerBoard,
  showPlacedShip,
  showSunkShip,
  changeCursorToDefault,
  showPlayerNames,
  updateHealthDOM,
} from './DOM';
import { computerMoveSpeed, ships } from './main';

export let player1;
export let player2;

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

  // Increase attacks counter for the right computer player
  function increaseAttacks(attacker) {
    if (attacker === player1) {
      player1.attacks++;
      return;
    }
    player2.attacks++;
  }

  // Change whose turn it is next after computer move
  function changeTurn(attacker) {
    if (attacker === player1) {
      player1.turn = false;
      player2.turn = true;
      return;
    }
    player1.turn = true;
    player2.turn = false;
  }

  // Play computer turn
  function playComputerTurn(attacker, enemy, enemyBoard) {
    setTimeout(() => {
      increaseAttacks(attacker);
      let attack;
      const coordinates = attacker.attack(enemy);
      const row = coordinates[0];
      const column = coordinates[1];
      const boardSquare = enemyBoard.querySelector(
        `div[data-row="${row}"][data-column="${column}"]`,
      );
      if (enemy.board.isAHit(row, column)) {
        const shipName = enemy.board.getSquare(row, column);
        const ship = enemy.board.findShip(shipName);
        boardSquare.classList.add('hit');
        updateHealthDOM(enemy);
        attack = 'hit';
        if (ship.isSunk()) {
          showSunkShip(enemy, enemyBoard, shipName);
          eventLog.addShipSunkEvent(
            attacker,
            enemy,
            ship.name,
            row,
            column,
            'ship-sunk',
          );
        } else {
          eventLog.addShipHitEvent(attacker, row, column, 'hit');
        }
      } else {
        boardSquare.classList.add('miss');
        eventLog.addShipMissedEvent(attacker, row, column, 'missed');
        attack = 'miss';
      }
      // Do not change turns if the attack was a hit
      if (attack === 'hit') {
        playTurn();
      } else {
        changeTurn(attacker);
        playTurn();
      }
    }, computerMoveSpeed);
  }

  // Check if the clicked square is a valid one for attack
  function isValidSquare(event) {
    if (
      event.target.classList.contains('header') ||
      event.target.classList.contains('hit') ||
      event.target.classList.contains('miss') ||
      event.target.classList.contains('sunk') ||
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
      const shipName = enemy.board.getSquare(row, column);
      const ship = enemy.board.findShip(shipName);
      boardSquare.classList.add('hit');
      updateHealthDOM(enemy);
      if (ship.isSunk()) {
        showSunkShip(enemy, enemyBoard, shipName);
        eventLog.addShipSunkEvent(
          attacker,
          enemy,
          ship.name,
          row,
          column,
          'ship-sunk',
        );
      } else {
        eventLog.addShipHitEvent(attacker, row, column, 'hit');
      }
      return 'hit';
    } else {
      boardSquare.classList.add('miss');
      eventLog.addShipMissedEvent(attacker, row, column, 'missed');
      return 'miss';
    }
  }

  // Event handler for playHumanTurn function attacking Player 2
  function attackPlayer2() {
    if (!isValidSquare(event)) {
      return;
    }
    player1.attacks++;
    const attack = playHumanTurn(event, player1, player2, player2Board);
    player2Board.removeEventListener('mousedown', attackPlayer2);
    // Do not change turns if the attack was a hit
    if (attack === 'hit') {
      playTurn();
    } else {
      player1.turn = false;
      player2.turn = true;
      playTurn();
    }
  }

  // Event handler for playHumanTurn function attacking Player 1
  function attackPlayer1() {
    if (!isValidSquare(event)) {
      return;
    }
    player2.attacks++;
    const attack = playHumanTurn(event, player2, player1, player1Board);
    player1Board.removeEventListener('mousedown', attackPlayer1);
    // Do not change turns if the attack was a hit
    if (attack === 'hit') {
      playTurn();
    } else {
      player1.turn = true;
      player2.turn = false;
      playTurn();
    }
  }

  // Play a turn
  function playTurn() {
    if (isGameOver()) {
      if (player1.health === 0) {
        return showGameOverModal(player2, player1);
      } else {
        return showGameOverModal(player1, player2);
      }
    }
    if (player1.turn && !player1.isHuman) {
      playComputerTurn(player1, player2, player2Board);
    } else if (player1.turn && player1.isHuman) {
      player2Board.addEventListener('mousedown', attackPlayer2);
    } else if (player2.turn && !player2.isHuman) {
      playComputerTurn(player2, player1, player1Board);
    } else if (player2.turn && player2.isHuman) {
      player1Board.addEventListener('mousedown', attackPlayer1);
    }
  }

  const player1Board = getPlayerBoard(player1);
  const player2Board = getPlayerBoard(player2);
  const eventLog = new EventLog(player1, player2);
  showPlayerNames(player1, player2);
  player1.turn = true;

  // Place all computer ships randomly
  if (player1.isHuman && !player2.isHuman) {
    player2.board.placeShipsRandomly(ships);
    changeCursorToDefault(player1Board);
  }
  if (player2.isHuman && !player1.isHuman) {
    player1.board.placeShipsRandomly(ships);
    changeCursorToDefault(player2Board);
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
    changeCursorToDefault(player1Board);
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
    changeCursorToDefault(player2Board);
  }
  playTurn();
}
