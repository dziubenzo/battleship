import '../css/main.scss';
import { loadImages, generateSquares } from './DOM';
import {
  showStartingModal,
  listenForLabelClick,
  getPlayerSelections,
} from './DOM.modals';

export const ERROR_MESSAGE_DISPLAY_DURATION = 700;

loadImages();
generateSquares();
showStartingModal();
listenForLabelClick();
getPlayerSelections();
