import { player1, player2, createPlayers, playGame } from './gameFlow';
import { Ship } from './ship';
import {
  getPlayerBoard,
  showErrorSquares,
  hideErrorSquares,
  showPlacedShip,
  removePlacedShips,
  clearPlacedShips,
  changeCursorToDefault,
  removeDefaultCursor,
  focusAndSelectName,
} from './DOM';
import {
  MESSAGE_DISPLAY_DURATION,
  GAME_OVER_MODAL_DISPLAY_DELAY,
  computerMoveSpeed,
  player1Name,
  player2Name,
  ships,
  readLocalStorage,
  updateGameVariables,
  resetValuesToDefault,
} from './main';

/* 

Starting modal

*/

// Show starting modal
export function showStartingModal() {
  const dialog = document.querySelector('#starting-dialog');
  dialog.showModal();
}

// Close starting modal
function hideStartingModal() {
  const dialog = document.querySelector('#starting-dialog');
  dialog.close();
}

// Add event listeners to starting modal player labels
export function listenForLabelClick() {
  // If label clicked, change its class to 'selected' for styling purposes
  function makeSelected(event) {
    const parent = event.target.parentNode;
    if (parent.querySelector('.selected') !== null) {
      parent.querySelector('.selected').classList.remove('selected');
      event.target.classList.add('selected');
    }
    event.target.classList.add('selected');
  }

  // If "Human" label clicked, display its corresponding player name input element
  // Otherwise hide it or keep it hidden
  function showOrHideNameFields(event) {
    const player1 = document.querySelector('label[for="human-player-1"]');
    const player2 = document.querySelector('label[for="human-player-2"]');
    const player1NameDiv = document.querySelector('.player-1-name');
    const player2NameDiv = document.querySelector('.player-2-name');
    const player1NameInput = document.querySelector('.player-1-name input');
    const player2NameInput = document.querySelector('.player-2-name input');
    const humanPlayer1RadioButton = document.querySelector(
      'input[name="player-1"][value="human"]',
    );
    const humanPlayer2RadioButton = document.querySelector(
      'input[name="player-2"][value="human"]',
    );

    if (event.target === player1) {
      player1NameDiv.style.visibility = 'visible';
      focusAndSelectName(humanPlayer1RadioButton, player1NameInput);
    } else if (event.target === player2) {
      player2NameDiv.style.visibility = 'visible';
      focusAndSelectName(humanPlayer2RadioButton, player2NameInput);
    } else if (event.target.parentNode.classList.value === 'player-1') {
      player1NameDiv.style.visibility = 'hidden';
    } else {
      player2NameDiv.style.visibility = 'hidden';
    }
  }

  // Enable Next/Start Game button if both players are selected
  // Change button description to Start Game if both players are computer players
  function enableButton() {
    const labelsSelected = document.querySelectorAll('label[class="selected"]');
    const button = document.querySelector('button[form="player-selection"]');
    let labelDescription1;
    let labelDescription2;
    if (labelsSelected.length === 2) {
      button.removeAttribute('disabled');
      labelDescription1 = labelsSelected[0].outerText;
      labelDescription2 = labelsSelected[1].outerText;
      if (
        labelDescription1.includes('Computer') &&
        labelDescription2.includes('Computer')
      ) {
        button.textContent = 'Start Game';
      } else {
        button.textContent = 'Place Ships';
      }
    }
  }

  const player1Labels = document.querySelectorAll('.player-1 label');
  const player2Labels = document.querySelectorAll('.player-2 label');

  player1Labels.forEach((label) => {
    label.addEventListener('click', (event) => {
      makeSelected(event);
      showOrHideNameFields(event);
      enableButton(event);
    });
  });

  player2Labels.forEach((label) => {
    label.addEventListener('click', (event) => {
      makeSelected(event);
      showOrHideNameFields(event);
      enableButton(event);
    });
  });
}

// Get player selections once the starting modal form is submitted
export function getPlayerSelections() {
  const form = document.querySelector('form[id="player-selection"]');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const selections = Object.fromEntries(new FormData(form));
    hideStartingModal();
    createPlayers(selections);
  });
}

/* 

Ship placement modal

*/

// Show ship placement modal
export function showShipPlacementModal() {
  const dialog = document.querySelector('#ship-placement-dialog');
  dialog.showModal();
}

// Show ship preview on board square hover and place it on board square click
export function placeShips(player, ships, ship, placeTheNextShip) {
  // Show ship preview when the cursor points at a board square
  function showShip(event) {
    if (
      event.target.className === 'square' ||
      event.target.className === 'square placed'
    ) {
      const row = Number(event.target.dataset.row);
      const column = Number(event.target.dataset.column);
      for (let shift = 0; shift < shipLength; shift++) {
        const squareColumn = column + shift;
        const squareRow = row + shift;
        // Do not show ship preview if the ship does not fit
        if (
          (column + shipLength > 10 && direction === 'horizontal') ||
          (row + shipLength > 10 && direction === 'vertical')
        ) {
          return;
        }
        if (direction === 'horizontal' && squareColumn < 10) {
          const square = board.querySelector(
            `div[data-row="${row}"][data-column="${squareColumn}"]`,
          );
          // Make sure that placed ships are not affected
          if (!square.classList.contains('placed')) {
            square.classList.add('preview');
          }
        }
        if (direction === 'vertical' && squareRow < 10) {
          const square = board.querySelector(
            `div[data-row="${squareRow}"][data-column="${column}"]`,
          );
          // Make sure that placed ships are not affected
          if (!square.classList.contains('placed')) {
            square.classList.add('preview');
          }
        }
      }
    }
  }
  // Hide ship if the square pointed at by the cursor changes
  function hideShip() {
    const previewSquares = board.querySelectorAll('.square.preview');
    for (const square of previewSquares) {
      square.classList.remove('preview');
    }
  }
  // Change ship preview direction
  // Show ship preview in the changed direction
  function rotateShip() {
    if (direction === 'horizontal') {
      direction = 'vertical';
    } else {
      direction = 'horizontal';
    }
    hideShip();
    showShip(event);
  }

  // Remove all event listeners
  function removeEventListeners() {
    board.removeEventListener('mousedown', addShip);
    board.removeEventListener('mouseover', showShip);
    board.removeEventListener('mouseout', hideShip);
    rotateShipIcon.removeEventListener('click', rotateShip);
    removeEventListener('auxclick', rotateShip);
    placeShipsRandomlyIcon.removeEventListener('click', placeShipsRandomly);
  }
  // Add ship to the player's board array if no errors thrown
  // Call itself again using the next ship stored in the ships array
  function addShip(event) {
    // Do nothing if headers or mouse button other than left mouse button clicked
    if (
      event.target.className === 'square header' ||
      event.button === 1 ||
      event.button === 2
    ) {
      return;
    }
    const row = Number(event.target.dataset.row);
    const column = Number(event.target.dataset.column);
    try {
      const newShip = new Ship(ship.length, ship.name);
      player.board.placeShip(newShip, row, column, direction);
      removeEventListeners();
      // Show placed ship on the ship placement board and the player board (in all cases except for human vs human)
      if (player1.isHuman && player2.isHuman) {
        showPlacedShip(ship, row, column, direction, board);
      } else {
        showPlacedShip(ship, row, column, direction, board);
        showPlacedShip(ship, row, column, direction, getPlayerBoard(player));
      }
      if (player.board.ships.length === ships.length) {
        currentShipInfo.textContent = "All ships placed, you're ready to go!";
        // Disable place ship randomly and rotate icons
        placeShipsRandomlyIcon.classList.add('icon-disabled', 'default-cursor');
        rotateShipIcon.classList.add('icon-disabled', 'default-cursor');
        changeCursorToDefault(board);
        if (player === player1 && player2.isHuman) {
          enableNextPlayerButton();
          return;
        } else {
          enableStartGame();
          return;
        }
      }
      placeTheNextShip(
        player,
        ships,
        ships[player.board.ships.length],
        placeShips,
      );
    } catch (error) {
      // Show error message for ERROR_MESSAGE_DISPLAY_DURATION milliseconds
      // Prevent board clicks to avoid current ship info being overwritten
      // Change ship preview squares to a different colour
      board.removeEventListener('mousedown', addShip);
      showErrorSquares();
      const infoCopy = currentShipInfo.textContent;
      // Get rid of Invalid Ship Placement from error message
      const shortenedMessage = error.message.slice(24);
      currentShipInfo.textContent = `${shortenedMessage}`;
      setTimeout(() => {
        hideErrorSquares();
        currentShipInfo.textContent = infoCopy;
        board.addEventListener('mousedown', addShip);
      }, MESSAGE_DISPLAY_DURATION);
    }
  }

  // Place all ships randomly
  function placeShipsRandomly() {
    if (player1.isHuman && player2.isHuman) {
      clearPlacedShips(board);
    } else {
      // Hide all previously placed ships in all scenarios except for human vs human
      removePlacedShips();
    }
    const randomShips = player.board.placeShipsRandomly(ships);
    // Show ships on both boards or on ship placement board only
    randomShips.forEach((ship, index) => {
      showPlacedShip(
        ships[index],
        ship.row,
        ship.column,
        ship.direction,
        board,
      );
      if (!player1.isHuman || !player2.isHuman) {
        showPlacedShip(
          ships[index],
          ship.row,
          ship.column,
          ship.direction,
          getPlayerBoard(player),
        );
      }
    });
    currentShipInfo.textContent = "You're ready to go!";
    changeCursorToDefault(board);
    // Remove all event listeners except for the place ship randomly one to enable rerolls
    removeEventListeners();
    placeShipsRandomlyIcon.addEventListener('click', placeShipsRandomly);
  }

  let direction = 'horizontal';
  const button = document.querySelector('button[class="start-game-button"]');
  const title = document.querySelector(
    '.ship-placement-dialog p[class="dialog-title"]',
  );
  title.textContent = `Place Your Ships, ${player.name}`;
  if (player === player1 && player2.isHuman) {
    button.textContent = 'Next Player';
  } else {
    button.textContent = 'Start Game';
  }
  const currentShipInfo = document.querySelector('p[class="current-ship"]');
  const shipName = ship.name;
  const shipLength = ship.length;
  const shipsCount = ships.length;
  currentShipInfo.textContent = `${
    player.board.ships.length + 1
  }/${shipsCount}: ${shipName}`;
  const board = document.querySelector('div[class="ship-placement-board"]');
  const rotateShipIcon = document.querySelector('img[alt="Rotate Ship Icon"]');
  const placeShipsRandomlyIcon = document.querySelector(
    'img[alt="Place Ships Randomly Icon"]',
  );

  board.addEventListener('mouseover', showShip);
  board.addEventListener('mouseout', hideShip);
  board.addEventListener('mousedown', addShip);
  rotateShipIcon.addEventListener('click', rotateShip);
  addEventListener('auxclick', rotateShip);
  placeShipsRandomlyIcon.addEventListener('click', placeShipsRandomly);
  if (player === player1 && player1.isHuman && player2.isHuman) {
    placeShipsRandomlyIcon.addEventListener('click', enableNextPlayerButton, {
      once: true,
    });
  } else {
    placeShipsRandomlyIcon.addEventListener('click', enableStartGame, {
      once: true,
    });
  }
}

// Enable Start Game button
function enableStartGame() {
  // Start the game and close the ship placement modal
  function startGame() {
    const dialog = document.querySelector('#ship-placement-dialog');
    const shipPlacementBoard = document.querySelector(
      'div[class="ship-placement-board"]',
    );
    dialog.close();
    clearPlacedShips(shipPlacementBoard);
    startGameButton.removeEventListener('click', startGame);
    playGame();
  }
  const startGameButton = document.querySelector('.start-game-button');
  const rotateShipIcon = document.querySelector('img[alt="Rotate Ship Icon"]');
  // Enable Start Game button
  startGameButton.removeAttribute('disabled');
  // Disable rotate ship icon
  rotateShipIcon.classList.add('icon-disabled', 'default-cursor');
  startGameButton.addEventListener('click', startGame);
}

// Enable button to allow human Player 2 to place their ships
function enableNextPlayerButton() {
  const nextPlayerButton = document.querySelector('.start-game-button');
  const rotateShipIcon = document.querySelector('img[alt="Rotate Ship Icon"]');
  // Enable Next Player button
  nextPlayerButton.removeAttribute('disabled');
  // Disable rotate ship icon
  rotateShipIcon.classList.add('icon-disabled', 'default-cursor');
  nextPlayerButton.addEventListener('click', placeShipsNextPlayer);
}

// Move to ship placing for next player
function placeShipsNextPlayer() {
  const nextPlayerButton = document.querySelector('.start-game-button');
  const placeShipsRandomlyIcon = document.querySelector(
    'img[alt="Place Ships Randomly Icon"]',
  );
  const rotateShipIcon = document.querySelector('img[alt="Rotate Ship Icon"]');
  const shipPlacementBoard = document.querySelector(
    'div[class="ship-placement-board"]',
  );
  // Reenable place ship randomly and rotate icons
  placeShipsRandomlyIcon.classList.remove('icon-disabled', 'default-cursor');
  rotateShipIcon.classList.remove('icon-disabled', 'default-cursor');
  clearPlacedShips(shipPlacementBoard);
  removeDefaultCursor(shipPlacementBoard);
  nextPlayerButton.setAttribute('disabled', 'disabled');
  nextPlayerButton.removeEventListener('click', placeShipsNextPlayer);
  placeShips(player2, ships, ships[0], placeShips);
}

/* 

Options modal

*/

// Open options modal on options icon click
// Go back to starting modal on back icon click or pressing Esc
// Listen for clicking Save and Reset icons
export function listenForOptionsModalClick() {
  // Show options modal
  function showOptionsModal() {
    dialog.showModal();
    // Remove focus from the first (any) field
    const firstInput = dialog.querySelector('input');
    firstInput.blur();
  }
  // Hide options modal
  function hideOptionsModal() {
    dialog.close();
  }
  const dialog = document.querySelector('#options-dialog');
  const optionsIcon = document.querySelector('img[alt="Options Icon"]');
  const backIcon = document.querySelector('img[alt="Back Icon"]');
  const optionsForm = document.querySelector('form[id="options"]');
  const resetIcon = document.querySelector('img[alt="Reset Icon"]');

  optionsIcon.addEventListener('click', () => {
    hideStartingModal();
    showOptionsModal();
    showCurrentOptionsValues();
  });
  backIcon.addEventListener('click', () => {
    hideOptionsModal();
    showStartingModal();
  });
  dialog.addEventListener('cancel', () => {
    hideOptionsModal();
    showStartingModal();
  });
  optionsForm.addEventListener('submit', (event) => {
    const saveMessage = document.querySelector('p[class*="save-message"]');
    showMessage(saveMessage);
    getFormValues(event);
  });
  resetIcon.addEventListener('click', () => {
    const resetMessage = document.querySelector('p[class*="reset-message"]');
    showMessage(resetMessage);
    resetValuesToDefault();
  });
}

// Show localStorage values in options modal fields and in starting modal name fields
export function showCurrentOptionsValues() {
  readLocalStorage();

  const player1NameField = document.querySelector(
    '.starting-dialog input[name="player-1-name"]',
  );
  const player2NameField = document.querySelector(
    '.starting-dialog input[name="player-2-name"]',
  );
  const defaultPlayer1NameField = document.querySelector(
    '.options-dialog input[name="player-1-name"]',
  );
  const defaultPlayer2NameField = document.querySelector(
    '.options-dialog input[name="player-2-name"]',
  );
  const computerMoveSpeedField = document.querySelector(
    '.options-dialog input[name="computer-speed"]',
  );
  const shipNameFields = document.querySelectorAll(
    '.options-bottom input[name*="name"]',
  );
  const shipLengthFields = document.querySelectorAll(
    '.options-bottom input[name*="length"]',
  );

  player1NameField.value = player1Name;
  player2NameField.value = player2Name;
  defaultPlayer1NameField.value = player1Name;
  defaultPlayer2NameField.value = player2Name;
  computerMoveSpeedField.value = computerMoveSpeed;
  ships.forEach((ship, index) => {
    shipNameFields[index].value = ship.name;
    shipLengthFields[index].value = ship.length;
  });
}

// Get values from the form and pass them to updateGameVariables
function getFormValues(event) {
  const form = document.querySelector('form[id="options"]');
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const computerMoveSpeed = Number(data['computer-speed']);
  const player1Name = data['player-1-name'].trim();
  const player2Name = data['player-2-name'].trim();
  const ships = [
    {
      length: Number(data['ship-1-length']),
      name: data['ship-1-name'].trim(),
    },
    {
      length: Number(data['ship-2-length']),
      name: data['ship-2-name'].trim(),
    },
    {
      length: Number(data['ship-3-length']),
      name: data['ship-3-name'].trim(),
    },
    {
      length: Number(data['ship-4-length']),
      name: data['ship-4-name'].trim(),
    },
    {
      length: Number(data['ship-5-length']),
      name: data['ship-5-name'].trim(),
    },
  ];
  const organisedData = {
    computerMoveSpeed,
    player1Name,
    player2Name,
    ships,
  };
  updateGameVariables(organisedData);
}

// Show options saved/reset to default message
function showMessage(messageDOM) {
  messageDOM.classList.add('showing');
  setTimeout(() => {
    messageDOM.classList.remove('showing');
  }, MESSAGE_DISPLAY_DURATION);
}

/* 

Game over modal

*/

// Show game over modal after a delay
export function showGameOverModal(winner, loser) {
  const dialog = document.querySelector('#game-over-dialog');
  showStats(winner, loser);
  setTimeout(() => {
    dialog.showModal();
  }, GAME_OVER_MODAL_DISPLAY_DELAY);
}

// Show stats
function showStats(winner, loser) {
  const winnerDOM = document.querySelector('p[class="winner"]');
  const winnerMovesDOM = document.querySelector('p[class="winner-moves"]');
  const loserMovesDOM = document.querySelector('p[class="loser-moves"]');
  const winnerAccuracyDOM = document.querySelector(
    'p[class="winner-accuracy"]',
  );
  const loserAccuracyDOM = document.querySelector('p[class="loser-accuracy"]');
  const newGameButton = document.querySelector(
    'button[class="new-game-button"]',
  );

  winnerDOM.textContent = winner.name;
  winnerMovesDOM.textContent = winner.attacks;
  loserMovesDOM.textContent = loser.attacks;
  winnerAccuracyDOM.textContent = `${winner.calculateAccuracy(loser)}%`;
  loserAccuracyDOM.textContent = `${loser.calculateAccuracy(winner)}%`;
  // Cover a corner case of the winner having 100% accuracy and the loser failing to play a single turn
  if (isNaN(loser.calculateAccuracy(winner))) {
    loserAccuracyDOM.textContent = `🤯`;
  }

  // Refresh page on clicking New Game button
  newGameButton.addEventListener('click', () => {
    location.reload();
  });
}

/* 

Pass device modal

*/

// Show pass device modal and change player's name
export function showPassDeviceModal(player) {
  const dialog = document.querySelector('#pass-device-dialog');
  const playerNameDOM = document.querySelector(
    '.pass-device-dialog .player-name',
  );
  playerNameDOM.textContent = player.name;
  dialog.showModal();
}

// Listen for clicking Continue button
// Close pass device modal on click
export function listenForContinueClick() {
  const dialog = document.querySelector('#pass-device-dialog');
  const continueButton = document.querySelector('.pass-device-dialog button');
  continueButton.addEventListener('click', () => {
    dialog.close();
  });
}
