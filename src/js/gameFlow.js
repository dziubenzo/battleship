import { Player, ComputerPlayer } from './player';
import { showShipPlacementModal, shopShipPreview } from './DOM.modals';

let player1;
let player2;
const ship = [{ name: 'TestShip', length: '5' }];

// Create appropriate players based on player selections
export function createPlayers(formData) {
  if (formData['player-1'] === 'human') {
    player1 = new Player(formData['player-1-name']);
  } else if (formData['player-1'] === 'computer') {
    player1 = new ComputerPlayer();
  } else {
    player1 = new ComputerPlayer(true);
  }

  if (formData['player-2'] === 'human') {
    player2 = new Player(formData['player-2-name']);
  } else if (formData['player-2'] === 'computer') {
    player2 = new ComputerPlayer();
  } else {
    player2 = new ComputerPlayer(true);
  }

  if (
    !(player1 instanceof ComputerPlayer) ||
    !(player2 instanceof ComputerPlayer)
  ) {
    showShipPlacementModal();
    shopShipPreview(ship);
  }
}
