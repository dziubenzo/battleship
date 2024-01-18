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

// Show ship preview for the current ship
export function shopShipPreview(ship) {
  // Show ship preview when the cursor points at a board square
  function showShip(event) {
    if (event.target.className === 'square') {
      event.target.classList.add('preview');
      const row = Number(event.target.dataset.row);
      const column = Number(event.target.dataset.column);
      for (let shift = 1; shift < shipLength; shift++) {
        const nextSquareColumn = column + shift;
        const nextSquareRow = row + shift;
        if (orientation === 'horizontal' && nextSquareColumn < 10) {
          const nextSquare = board.querySelector(
            `div[data-row="${row}"][data-column="${nextSquareColumn}"]`,
          );
          nextSquare.classList.add('preview');
        }
        if (orientation === 'vertical' && nextSquareRow < 10) {
          const nextSquare = board.querySelector(
            `div[data-row="${nextSquareRow}"][data-column="${column}"]`,
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

  let orientation = 'horizontal';
  const board = document.querySelector('div[class="ship-placement-board"]');
  const shipLength = ship[0]['length'];

  board.addEventListener('mouseover', showShip);
  board.addEventListener('mouseout', hideShip);
  listenForChangeOrientation();
}
