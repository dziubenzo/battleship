import '../css/main.scss';
import { loadIcons, generateSquares, doNotCloseModalsOnEsc } from './DOM';
import {
  showStartingModal,
  listenForLabelClick,
  getPlayerSelections,
  listenForOptionsModalClick,
} from './DOM.modals';

export const ERROR_MESSAGE_DISPLAY_DURATION = 700;
export const COMPUTER_MOVE_DURATION = 100;

loadIcons();
generateSquares();
showStartingModal();
doNotCloseModalsOnEsc();
listenForLabelClick();
getPlayerSelections();
listenForOptionsModalClick();
