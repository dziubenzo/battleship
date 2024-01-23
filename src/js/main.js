import '../css/main.scss';
import { loadIcons, generateSquares, doNotCloseModalsOnEsc } from './DOM';
import {
  showStartingModal,
  listenForLabelClick,
  getPlayerSelections,
  listenForOptionsModalClick,
} from './DOM.modals';

// Default unmodifiable game variables
export const ERROR_MESSAGE_DISPLAY_DURATION = 700;

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

// Starter pack
loadIcons();
generateSquares();
showStartingModal();
doNotCloseModalsOnEsc();
listenForLabelClick();
getPlayerSelections();
listenForOptionsModalClick();
