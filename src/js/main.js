import '../css/main.scss';
import { loadImages, generateSquares } from './DOM';
import {
  showStartingModal,
  listenForLabelClick,
  getPlayerSelections,
} from './DOM.modals';

loadImages();
generateSquares();
showStartingModal();
listenForLabelClick();
getPlayerSelections();
