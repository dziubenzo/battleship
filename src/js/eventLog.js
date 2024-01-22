import { Player } from './player';

export class EventLog {
  #verbs = [
    'attacks',
    'strikes',
    'fires at',
    'invades',
    'raids',
    'storms',
    'assails',
    'assaults',
  ];
  #missPhrases = [
    'Unlucky',
    'Better luck next time',
    'The game goes on',
    "Don't get upset",
    'Hold your horses',
  ];

  constructor(player1, player2) {
    if (arguments.length !== 2) {
      throw new Error('Invalid arguments');
    }
    if (!(player1 instanceof Player) || !(player2 instanceof Player)) {
      throw new Error(
        'Both arguments must be an instance of Player/ComputerPlayer class',
      );
    }
    this.player1 = player1;
    this.player2 = player2;
    this.moves = player1.attacks + player2.attacks;
  }

  // Update moves
  #updateMoves() {
    this.moves = this.player1.attacks + this.player2.attacks;
  }

  // Get random integer between min and max, max is exclusive
  #getRandomInt(min, max) {
    return Math.floor(Math.random() * (min - max) + max);
  }

  // Create a new event and add it to the DOM
  // Return description paragraph for further manipulation
  #createEvent() {
    const eventLogDOM = document.querySelector('.event-log');
    const eventDOM = document.createElement('div');
    eventDOM.classList.add('event');
    const turnDOM = document.createElement('p');
    turnDOM.classList.add('turn');
    this.#updateMoves();
    turnDOM.textContent = this.moves;
    const descriptionDOM = document.createElement('p');
    descriptionDOM.classList.add('description');
    eventDOM.append(turnDOM, descriptionDOM);
    eventLogDOM.insertBefore(eventDOM, eventLogDOM.firstChild);
    return descriptionDOM;
  }

  // Get coordinates of board square
  getCoordinates(row, column) {
    if (arguments.length !== 2) {
      throw new Error('Invalid arguments');
    }
    const rowMap = {
      0: 'A',
      1: 'B',
      2: 'C',
      3: 'D',
      4: 'E',
      5: 'F',
      6: 'G',
      7: 'H',
      8: 'I',
      9: 'J',
    };
    const rowCoordinate = rowMap[row];
    const columnCoordinate = Number(column) + 1;
    return rowCoordinate + columnCoordinate;
  }

  // Add ship hit event
  addHitEvent(attacker, row, column, className) {
    const randomInt = this.#getRandomInt(0, this.#verbs.length);
    const descriptionDOM = this.#createEvent();
    const coordinates = this.getCoordinates(row, column);
    descriptionDOM.innerHTML = `<span class="bold">${attacker.name}</span> ${this.#verbs[randomInt]} <span class="bold">${coordinates}</span>, and <span class="bold">hits</span> a ship!<br><span class="bold">${attacker.name}</span> gets to play another turn.`;
    descriptionDOM.classList.add(`${className}`);
  }
}
