import { Player } from './player';

export class EventLog {
  #attackVerbs = [
    'attacks',
    'fires at',
    'invades',
    'raids',
    'storms',
    'assails',
    'assaults',
  ];
  #hitVerbs = ['hits', 'damages', 'strikes'];
  #shipSunkVerbs = ['sinks', 'there goes', 'destroys', 'ends', 'obliterates'];
  #missVerbs = [
    'misses',
    'is off',
    'is unsuccessful in their efforts',
    'fails to score a hit',
    'hits the ocean instead',
  ];
  #missPhrases = [
    'Unlucky',
    'Better luck next time',
    'The game goes on',
    "Don't get upset",
    'Hold your horses',
    "That's just the way it is",
  ];
  #gameOverPhrases = [
    'emerges victorious',
    'is the winner',
    'wins',
    'is the last man standing',
    'outplayed their opponent',
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

  // Add game over event
  #addGameOverEvent(attacker, className) {
    const randomIntPhrases = this.#getRandomInt(
      0,
      this.#gameOverPhrases.length,
    );
    const descriptionDOM = this.#createEvent();
    descriptionDOM.innerHTML = `<span class="bold">${attacker.name}</span> ${this.#gameOverPhrases[randomIntPhrases]}!`;
    descriptionDOM.classList.add(`${className}`);
    const turnDOM = document.querySelector('.event > .turn');
    turnDOM.textContent = 'GG';
  }

  // Scroll event log to top
  #scrollToTop() {
    const eventLogDOM = document.querySelector('.event-log');
    eventLogDOM.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
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
  addShipHitEvent(attacker, row, column, className) {
    const randomIntVerbs = this.#getRandomInt(0, this.#attackVerbs.length);
    const randomIntShipHit = this.#getRandomInt(0, this.#hitVerbs.length);
    const descriptionDOM = this.#createEvent();
    const coordinates = this.getCoordinates(row, column);
    descriptionDOM.innerHTML = `<span class="bold">${attacker.name}</span> ${this.#attackVerbs[randomIntVerbs]} <span class="bold">${coordinates}</span>, and <span class="bold">${this.#hitVerbs[randomIntShipHit]}</span> a ship! <br><br><span class="bold">${attacker.name}</span> gets to play another turn.`;
    descriptionDOM.classList.add(`${className}`);
    this.#scrollToTop();
  }

  // Add ship sunk event
  addShipSunkEvent(attacker, enemy, shipName, row, column, className) {
    const randomIntVerbs = this.#getRandomInt(0, this.#attackVerbs.length);
    const randomIntShipSunk = this.#getRandomInt(0, this.#shipSunkVerbs.length);
    const descriptionDOM = this.#createEvent();
    const coordinates = this.getCoordinates(row, column);
    descriptionDOM.innerHTML = `<span class="bold">${attacker.name}</span> ${this.#attackVerbs[randomIntVerbs]} <span class="bold">${coordinates}</span>, and <span class="bold">${this.#shipSunkVerbs[randomIntShipSunk]}</span> ${enemy.name}'s <span class="bold">${shipName}</span>!`;
    // Make sure that there will be a next turn
    if (!enemy.board.areAllShipsDown()) {
      descriptionDOM.innerHTML += `<br><br>Not only that, it's <span class="bold">${attacker.name}'s</span> turn again.`;
    }
    if (enemy.board.areAllShipsDown()) {
      this.#addGameOverEvent(attacker, 'game-over');
    }
    descriptionDOM.classList.add(`${className}`);
    this.#scrollToTop();
  }

  // Add ship missed event
  addShipMissedEvent(attacker, row, column, className) {
    const randomIntVerbs = this.#getRandomInt(0, this.#attackVerbs.length);
    const randomIntShipMissed = this.#getRandomInt(0, this.#missVerbs.length);
    const randomIntPhrases = this.#getRandomInt(0, this.#missPhrases.length);
    const descriptionDOM = this.#createEvent();
    const coordinates = this.getCoordinates(row, column);
    descriptionDOM.innerHTML = `<span class="bold">${attacker.name}</span> ${this.#attackVerbs[randomIntVerbs]} <span class="bold">${coordinates}</span>, but <span class="bold">${this.#missVerbs[randomIntShipMissed]}</span>. <br><br>${this.#missPhrases[randomIntPhrases]}, <span class="bold">${attacker.name}</span>!`;
    descriptionDOM.classList.add(`${className}`);
    this.#scrollToTop();
  }
}
