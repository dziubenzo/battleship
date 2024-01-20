import gitHubLogoWhiteSrc from '../assets/github-logo-white.svg';
import gitHubLogoBlackSrc from '../assets/github-logo-black.svg';
import settingsSrc from '../assets/settings.svg';
import rotateShipSrc from '../assets/rotate.svg';
import placeShipsRandomlySrc from '../assets/place-ships-randomly.svg';
import { player1, player2 } from './gameFlow';

const NO_OF_SQUARES = 121;

// Load images
export function loadImages() {
  const gitHubLogo = document.querySelector('img[alt="GitHub Logo"]');
  gitHubLogo.src = gitHubLogoWhiteSrc;
  const settingsIcon = document.querySelector('img[alt="Settings Icon"]');
  settingsIcon.src = settingsSrc;
  const rotateShipIcon = document.querySelector('img[alt="Rotate Ship Icon"]');
  rotateShipIcon.src = rotateShipSrc;
  const placeShipsRandomlyIcon = document.querySelector(
    'img[alt="Place Ships Randomly Icon"]',
  );
  placeShipsRandomlyIcon.src = placeShipsRandomlySrc;
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

// Return the right DOM board based on player passed as argument
export function getPlayerBoard(player) {
  if (player === player1) {
    return document.querySelector('div[class="player-1-board"');
  }
  return document.querySelector('div[class="player-2-board"');
}
