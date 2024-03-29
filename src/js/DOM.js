import gitHubLogoWhiteSrc from '../assets/github-logo-white.svg';
import gitHubLogoBlackSrc from '../assets/github-logo-black.svg';
import optionsSrc from '../assets/options.svg';
import rotateShipSrc from '../assets/rotate.svg';
import placeShipsRandomlySrc from '../assets/place-ships-randomly.svg';
import healthSrc from '../assets/health.svg';
import resetSrc from '../assets/reset.svg';
import saveSrc from '../assets/save.svg';
import backSrc from '../assets/back.svg';
import { player1 } from './gameFlow';
import { LOW_HEALTH_THRESHOLD } from './main';

const NO_OF_SQUARES = 121;

// Load icons
export function loadIcons() {
  const gitHubLogo = document.querySelector('img[alt="GitHub Logo"]');
  const html = document.querySelector('html');
  if (html.dataset.theme === 'dark') {
    gitHubLogo.src = gitHubLogoWhiteSrc;
  } else {
    gitHubLogo.src = gitHubLogoBlackSrc;
  }
  const optionsIcon = document.querySelector('img[alt="Options Icon"]');
  optionsIcon.src = optionsSrc;
  const rotateShipIcon = document.querySelector('img[alt="Rotate Ship Icon"]');
  rotateShipIcon.src = rotateShipSrc;
  const placeShipsRandomlyIcon = document.querySelector(
    'img[alt="Place Ships Randomly Icon"]',
  );
  placeShipsRandomlyIcon.src = placeShipsRandomlySrc;
  const player1HealthIcon = document.querySelector('.player-1-health > img');
  const player2HealthIcon = document.querySelector('.player-2-health > img');
  player1HealthIcon.src = healthSrc;
  player2HealthIcon.src = healthSrc;
  const resetIcon = document.querySelector('img[alt="Reset Icon"]');
  const saveIcon = document.querySelector('img[alt="Save Icon"]');
  resetIcon.src = resetSrc;
  saveIcon.src = saveSrc;
  const backIcon = document.querySelector('img[alt="Back Icon"]');
  backIcon.src = backSrc;
}

// Generate board squares
export function generateSquares() {
  // Add header descriptions to board headers
  function addHeaders() {
    const headerDescriptions = {
      0: '',
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
      10: '10',
      11: 'A',
      22: 'B',
      33: 'C',
      44: 'D',
      55: 'E',
      66: 'F',
      77: 'G',
      88: 'H',
      99: 'I',
      110: 'J',
    };
    const headers = document.querySelectorAll('.square.header');
    headers.forEach((header) => {
      header.textContent = headerDescriptions[header.dataset.id];
    });
  }

  const player1Board = document.querySelector('div[class="player-1-board"]');
  const player2Board = document.querySelector('div[class="player-2-board"]');
  const shipPlacementBoard = document.querySelector(
    'div[class="ship-placement-board"]',
  );
  const boards = [player1Board, player2Board, shipPlacementBoard];
  const headers = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22, 33, 44, 55, 66, 77, 88, 99, 110,
  ];

  for (const board of boards) {
    let row = 0;
    let column = 0;
    for (let i = 0; i < NO_OF_SQUARES; i++) {
      const square = document.createElement('div');
      square.classList.add('square');
      square.dataset.id = i;
      board.append(square);
      // Do not add column or row data attributes to headers
      if (headers.includes(i)) {
        square.classList.add('header');
        continue;
      }
      square.dataset.row = row;
      square.dataset.column = column;
      if (column === 9) {
        column = 0;
        row++;
        continue;
      }
      column++;
    }
  }
  addHeaders();
}

// Do not close starting and ship placement modals on pressing Esc
export function doNotCloseModalsOnEsc() {
  const startingModal = document.querySelector('dialog[id="starting-dialog"]');
  const shipPlacementModal = document.querySelector(
    'dialog[id="ship-placement-dialog"]',
  );
  [startingModal, shipPlacementModal].forEach((modal) => {
    modal.addEventListener('cancel', (event) => {
      event.preventDefault();
    });
  });
}

// Return the right DOM board based on player passed as argument
export function getPlayerBoard(player) {
  if (player === player1) {
    return document.querySelector('div[class="player-1-board"');
  }
  return document.querySelector('div[class="player-2-board"');
}

// Indicate invalid ship placement attempt by changing ship preview squares to a different colour
export function showErrorSquares() {
  const shipPreviewSquares = document.querySelectorAll('.square.preview');
  for (const square of shipPreviewSquares) {
    square.className = 'square error';
  }
}

// Change ship preview squares back to normal squares
export function hideErrorSquares() {
  const shipPreviewErrorSquares = document.querySelectorAll('.square.error');
  for (const square of shipPreviewErrorSquares) {
    square.className = 'square';
  }
}

// Show placed ship on the board
export function showPlacedShip(ship, row, column, direction, boardDOM) {
  for (let shift = 0; shift < ship.length; shift++) {
    if (direction === 'horizontal') {
      const squareColumn = column + shift;
      const square = boardDOM.querySelector(
        `div[data-row="${row}"][data-column="${squareColumn}"]`,
      );
      square.className = 'square placed';
    }
    if (direction === 'vertical') {
      const squareRow = row + shift;
      const square = boardDOM.querySelector(
        `div[data-row="${squareRow}"][data-column="${column}"]`,
      );
      square.className = 'square placed';
    }
  }
}

// Remove all placed ships from all boards
export function removePlacedShips() {
  const placedShips = document.querySelectorAll('.square.placed');
  for (const placedShip of placedShips) {
    placedShip.className = 'square';
  }
}

// Clear placed ships from a board
export function clearPlacedShips(boardDOM) {
  const placedShips = boardDOM.querySelectorAll('.square.placed');
  for (const placedShip of placedShips) {
    placedShip.classList.remove('placed');
  }
}

// Show all player's ships on their board (for 2-player mode)
export function showAllPlacedShips(player, playerBoardDOM) {
  for (let row = 0; row < 10; row++) {
    for (let column = 0; column < 10; column++) {
      const square = player.board.getSquare(row, column);
      if (typeof square === 'string' && square !== 'unavailable') {
        const squareDOM = playerBoardDOM.querySelector(
          `div[data-row="${row}"][data-column="${column}"]`,
        );
        squareDOM.classList.add('placed');
      }
    }
  }
}

// Show sunk ship differently on the board
export function showSunkShip(enemy, enemyBoard, shipName) {
  const hitSquares = enemyBoard.querySelectorAll('.hit');
  for (const square of hitSquares) {
    const row = square.dataset.row;
    const column = square.dataset.column;
    const squareValue = enemy.board.getSquare(row, column);
    if (squareValue === shipName) {
      square.classList.remove('hit');
      square.classList.add('sunk');
    }
  }
}

// Change cursor to default for human player board squares and for boards in the computer vs computer scenario
export function changeCursorToDefault(boardDOM) {
  const squares = boardDOM.querySelectorAll('.square');
  for (const square of squares) {
    square.classList.add('default-cursor');
  }
}

// Remove default cursor from board squares
export function removeDefaultCursor(boardDOM) {
  const squares = boardDOM.querySelectorAll('.default-cursor');
  for (const square of squares) {
    square.classList.remove('default-cursor');
  }
}

// Show player names on main page
export function showPlayerNames(player1, player2) {
  const player1NameDOM = document.querySelector('p[class="player-1-name"]');
  const player2NameDOM = document.querySelector('p[class="player-2-name"]');
  player1NameDOM.textContent = player1.name;
  player2NameDOM.textContent = player2.name;
}

// Update health in the DOM
export function updateHealthDOM(enemy) {
  let healthValue;
  let healthIcon;
  if (enemy === player1) {
    healthValue = document.querySelector('.player-1-health > .health-percent');
    healthIcon = document.querySelector('.player-1-health > img');
  } else {
    healthValue = document.querySelector('.player-2-health > .health-percent');
    healthIcon = document.querySelector('.player-2-health > img');
  }
  healthValue.textContent = enemy.health;
  // Change text and icon colour when health is low
  if (enemy.health <= LOW_HEALTH_THRESHOLD) {
    healthValue.classList.add('low-health');
    healthIcon.classList.add('icon-low-health');
  }
}

// Listen for changing colour theme
export function listenForChangingTheme() {
  // Set colour theme based on localStorage
  // Otherwise set dark theme
  function setTheme() {
    let theme = 'dark';
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', theme);
      return;
    }
    theme = localStorage.getItem('theme');
    html.dataset.theme = theme;
  }

  const html = document.querySelector('html');
  const themeToggle = document.querySelector('img[class="theme-toggle"]');
  const gitHubLogo = document.querySelector('img[alt="GitHub Logo"]');
  setTheme();

  themeToggle.addEventListener('click', () => {
    if (html.dataset.theme === 'dark') {
      html.dataset.theme = 'light';
      gitHubLogo.src = gitHubLogoBlackSrc;
      localStorage.setItem('theme', 'light');
      return;
    }
    html.dataset.theme = 'dark';
    gitHubLogo.src = gitHubLogoWhiteSrc;
    localStorage.setItem('theme', 'dark');
  });
}

// Focus on and select player name
// Also force checked for the human radio button value because it does not work on label click when the select() method is used
export function focusAndSelectName(radioButton, nameField) {
  nameField.focus();
  nameField.select();
  radioButton.checked = true;
}

// Scroll to the right player board when playing on mobile
export function scrollToBoard(boardDOM) {
  boardDOM.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
