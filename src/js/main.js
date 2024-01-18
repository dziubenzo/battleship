import '../css/main.scss';
import { loadImages, generateSquares } from './DOM';
import {
  showStartingModal,
  showShipPlacementModal,
  listenForLabelClick,
  getPlayerSelections,
} from './DOM.modals';

loadImages();
generateSquares();
showStartingModal();
// showShipPlacementModal();
listenForLabelClick();
getPlayerSelections();
