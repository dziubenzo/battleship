import '../css/main.scss';
import { loadIcons, generateSquares, doNotCloseModalsOnEsc } from './DOM';
import {
  showStartingModal,
  listenForLabelClick,
  getPlayerSelections,
  listenForOptionsModalClick,
  showCurrentOptionsValues,
} from './DOM.modals';

// Default unmodifiable game variables
export const ERROR_MESSAGE_DISPLAY_DURATION = 700;
export const LOW_HEALTH_THRESHOLD = 20;

// Default modifiable game variables
export const defaultComputerMoveSpeed = 1000;
export const defaultPlayer1Name = '';
export const defaultPlayer2Name = '';
export const defaultShips = [
  {
    length: 5,
    name: 'Carrier',
  },
  {
    length: 4,
    name: 'Battleship',
  },
  {
    length: 3,
    name: 'Destroyer',
  },
  {
    length: 3,
    name: 'Submarine',
  },
  {
    length: 2,
    name: 'Patrol Boat',
  },
];

// Modifiable game variables
export let computerMoveSpeed = 1000;
export let player1Name = '';
export let player2Name = '';
export let ships = [
  {
    length: 5,
    name: 'Carrier',
  },
  {
    length: 4,
    name: 'Battleship',
  },
  {
    length: 3,
    name: 'Destroyer',
  },
  {
    length: 3,
    name: 'Submarine',
  },
  {
    length: 2,
    name: 'Patrol Boat',
  },
];

// Read values from localStorage if they exist
// Otherwise save default values to localStorage
export function readLocalStorage() {
  if (!localStorage.getItem('computerMoveSpeed')) {
    localStorage.setItem('player1Name', defaultPlayer1Name);
    localStorage.setItem('player2Name', defaultPlayer2Name);
    localStorage.setItem('computerMoveSpeed', defaultComputerMoveSpeed);
    localStorage.setItem('ships', JSON.stringify(defaultShips));
  } else {
    player1Name = localStorage.getItem('player1Name');
    player2Name = localStorage.getItem('player2Name');
    computerMoveSpeed = localStorage.getItem('computerMoveSpeed');
    ships = JSON.parse(localStorage.getItem('ships'));
  }
}

// Update localStorage
function updateLocalStorage() {
  localStorage.setItem('computerMoveSpeed', computerMoveSpeed);
  localStorage.setItem('player1Name', player1Name);
  localStorage.setItem('player2Name', player2Name);
  localStorage.setItem('ships', JSON.stringify(ships));
}

// Update game variables after clicking Save icon in options modal
export function updateGameVariables(formData) {
  player1Name = formData.player1Name;
  player2Name = formData.player2Name;
  computerMoveSpeed = formData.computerMoveSpeed;
  ships = formData.ships;
  // Update localStorage and value fields in modals
  updateLocalStorage();
  showCurrentOptionsValues();
}

// Starter pack
loadIcons();
generateSquares();
showStartingModal();
doNotCloseModalsOnEsc();
listenForLabelClick();
getPlayerSelections();
listenForOptionsModalClick();
showCurrentOptionsValues();
