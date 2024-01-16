import gitHubLogoWhite from '../assets/github-logo-white.svg';
import gitHubLogoBlack from '../assets/github-logo-black.svg';

const SQUARES = 121;

// Load images
export function loadImages() {
  const gitHubLogo = document.querySelector('img[alt="GitHub Logo"]');
  gitHubLogo.src = gitHubLogoWhite;
}

// Generate squares
export function generateSquares() {
  const playerBoard = document.querySelector('div[class="player-board"]');
  const enemyBoard = document.querySelector('div[class="enemy-board"]');
  const boards = [playerBoard, enemyBoard];
  const headers = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22, 33, 44, 55, 66, 77, 88, 99, 110,
  ];

  for (const board of boards) {
    let row = 0;
    let column = 0;
    for (let i = 0; i < SQUARES; i++) {
      const square = document.createElement('div');
      square.classList.add('square');
      square.dataset.id = i + 1;
      if (headers.includes(i)) {
        square.classList.add('header');
        board.append(square);
        continue;
      }
      square.dataset.row = row;
      square.dataset.column = column;
      board.append(square);
      if (column === 9) {
        column = 0;
        row++;
        continue;
      }
      column++;
    }
  }
}
