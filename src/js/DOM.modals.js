import { createPlayers } from './gameFlow';

/* 

Starting modal

*/

// Show starting modal
export function showStartingModal() {
  const dialog = document.querySelector('#starting-dialog');
  dialog.showModal();
  // Prevent it from being closed on clicking Esc
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
  });
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

    if (event.target === player1) {
      player1NameDiv.style.visibility = 'visible';
      player1NameInput.focus();
    } else if (event.target === player2) {
      player2NameDiv.style.visibility = 'visible';
      player2NameInput.focus();
    } else if (event.target.parentNode.classList.value === 'player-1') {
      player1NameDiv.style.visibility = 'hidden';
      player1NameInput.value = '';
    } else {
      player2NameDiv.style.visibility = 'hidden';
      player2NameInput.value = '';
    }
  }

  const player1Labels = document.querySelectorAll('.player-1 label');
  const player2Labels = document.querySelectorAll('.player-2 label');

  player1Labels.forEach((label) => {
    label.addEventListener('click', (event) => {
      makeSelected(event);
      showOrHideNameFields(event);
    });
  });

  player2Labels.forEach((label) => {
    label.addEventListener('click', (event) => {
      makeSelected(event);
      showOrHideNameFields(event);
    });
  });
}

// Get player selections once the starting modal form is submitted
export function getPlayerSelections() {
  // Close starting modal
  function hideStartingModal() {
    const dialog = document.querySelector('#starting-dialog');
    dialog.close();
  }

  const form = document.querySelector('form[id="player-selection"]');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const selections = Object.fromEntries(new FormData(form));
    // Make sure that both players are selected before moving forward
    if (!selections['player-1'] || !selections['player-2']) {
      return;
    }
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
  // Prevent it from being closed on clicking Esc
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
  });
}

// Show ship preview on board square hover and place it on board square click
export function placeShips(player, ships, ship, placeTheNextShip) {
  // Show ship preview when the cursor points at a board square
  function showShip(event) {
    if (event.target.className === 'square') {
      const row = Number(event.target.dataset.row);
      const column = Number(event.target.dataset.column);
      for (let shift = 0; shift < shipLength; shift++) {
        const squareColumn = column + shift;
        const squareRow = row + shift;
        // Do not show ship preview if the ship does not fit
        if (
          (column + shipLength > 10 && orientation === 'horizontal') ||
          (row + shipLength > 10 && orientation === 'vertical')
        ) {
          return;
        }
        if (orientation === 'horizontal' && squareColumn < 10) {
          const nextSquare = board.querySelector(
            `div[data-row="${row}"][data-column="${squareColumn}"]`,
          );
          nextSquare.classList.add('preview');
        }
        if (orientation === 'vertical' && squareRow < 10) {
          const nextSquare = board.querySelector(
            `div[data-row="${squareRow}"][data-column="${column}"]`,
          );
          nextSquare.classList.add('preview');
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
  // Change ship preview orientation on icon click or middle mouse button press
  function listenForChangeOrientation() {
    function rotateShip() {
      if (orientation === 'horizontal') {
        orientation = 'vertical';
      } else {
        orientation = 'horizontal';
      }
    }
    const rotateShipIcon = document.querySelector(
      'img[alt="Rotate Ship Icon"]',
    );
    rotateShipIcon.addEventListener('click', rotateShip);
    addEventListener('auxclick', () => {
      rotateShip();
      hideShip();
      showShip(event);
    });
  }
  // Add ship to the player's board array if no errors thrown
  // Call itself again using the next ship stored in the ships array
  function addShip(event) {
    // Do nothing if headers clicked
    if (event.target.className === 'square header') {
      return;
    }
    const row = Number(event.target.dataset.row);
    const column = Number(event.target.dataset.column);
    try {
      player.board.placeShip(ship, row, column, orientation);
      showPlacedShip(ship, row, column, orientation);
      board.removeEventListener('click', addShip);
      board.removeEventListener('mouseover', showShip);
      board.removeEventListener('mouseout', hideShip);
      if (player.board.ships.length === ships.length) {
        currentShipInfo.textContent = "All ships placed, you're ready to go!";
        return;
      }
      placeTheNextShip(
        player,
        ships,
        ships[player.board.ships.length],
        placeShips,
      );
    } catch (error) {
      // Show error message for 1 second
      // Prevent board clicks to avoid current ship info being overwritten
      board.removeEventListener('click', addShip);
      const infoCopy = currentShipInfo.textContent;
      currentShipInfo.textContent = `${error.message}`;
      setTimeout(() => {
        currentShipInfo.textContent = infoCopy;
        board.addEventListener('click', addShip);
      }, 1000);
    }
  }

  let orientation = 'horizontal';
  const currentShipInfo = document.querySelector('p[class="current-ship"]');
  const shipName = ship.name;
  const shipLength = ship.length;
  const shipsCount = ships.length;
  currentShipInfo.textContent = `${
    player.board.ships.length + 1
  }/${shipsCount}: ${shipName}`;
  const board = document.querySelector('div[class="ship-placement-board"]');

  listenForChangeOrientation();

  board.addEventListener('mouseover', showShip);
  board.addEventListener('mouseout', hideShip);
  board.addEventListener('click', addShip);
  return;
}

// Show placed ship on the ship placement board
export function showPlacedShip(ship, row, column, orientation) {
  const board = document.querySelector('div[class="ship-placement-board"]');
  for (let shift = 0; shift < ship.length; shift++) {
    if (orientation === 'horizontal') {
      const squareColumn = column + shift;
      const square = board.querySelector(
        `div[data-row="${row}"][data-column="${squareColumn}"]`,
      );
      square.className = 'square placed';
    }
    if (orientation === 'vertical') {
      const squareRow = row + shift;
      const square = board.querySelector(
        `div[data-row="${squareRow}"][data-column="${column}"]`,
      );
      square.className = 'square placed';
    }
  }
}
