/* eslint no-undef: 0 */

import { Player } from '../player';
import { Ship } from '../ship';

// attack() that calls receiveAttack()
// extend Player to Computer
// two Computer levels

describe('Player', () => {
  test('creates default human player if no name given', () => {
    expect(new Player().name).toBe('Player');
  });

  test.each([['Ron'], ['Harry'], ['Hermione']])(
    'creates human player with name if name given (%s)',
    (name) => {
      expect(new Player(name).name).toBe(name);
    },
  );

  test.each([[null], [undefined], [Infinity], [NaN], [1992]])(
    'converts name argument to string if argument given (%s)',
    (name) => {
      expect(typeof new Player(name).name).toBe('string');
    },
  );
});

describe('Player: attack()', () => {
  let player1 = new Player('Player 1');
  let player2 = new Player('Player 2');
  let carrier = new Ship(5, 'Carrier');
  let battleship = new Ship(4, 'Battleship');
  let destroyer = new Ship(3, 'Destroyer');
  let submarine = new Ship(3, 'Submarine');
  let patrolBoat = new Ship(2, 'Patrol Boat');
  player1.board.placeShip(carrier, 0, 1, 'horizontal');
  player1.board.placeShip(battleship, 2, 5, 'horizontal');
  player1.board.placeShip(destroyer, 4, 0, 'horizontal');
  player1.board.placeShip(submarine, 6, 7, 'horizontal');
  player1.board.placeShip(patrolBoat, 9, 2, 'horizontal');
  player2.board.placeShip(carrier, 0, 5, 'horizontal');
  player2.board.placeShip(battleship, 2, 0, 'horizontal');
  player2.board.placeShip(destroyer, 4, 0, 'horizontal');
  player2.board.placeShip(submarine, 5, 7, 'horizontal');
  player2.board.placeShip(patrolBoat, 7, 8, 'horizontal');

  test.each([
    ['hit', player2.board.hits, player2, 0, 7],
    ['miss', player2.board.misses, player2, 2, 8],
  ])(
    "registers a %s on opponent's board",
    (scenario, array, opponent, row, column) => {
      player1.attack(opponent, row, column);
      expect(array).toHaveLength(1);
      expect(array).toEqual([[row, column]]);
    },
  );

  test.each([
    [player1.board.hits, player1, 0, 1],
    [player1.board.misses, player1, 4, 8],
  ])('works the other way around', (array, opponent, row, column) => {
    player2.attack(opponent, row, column);
    expect(array).toHaveLength(1);
    expect(array).toEqual([[row, column]]);
  });

  test.each([['Opponent'], [null], [Infinity], [1992], [[1, 2, 3]]])(
    'throws error if the first argument is not Player instance (%s)',
    (argument) => {
      expect(() => {
        player1.attack(argument, 0, 0);
      }).toThrow('The first argument must be an instance of Player class');
    },
  );

  test('throws error if row or column is not a string number or a number', () => {
    expect(() => {
      player1.attack(player2, 'Test', 0);
    }).toThrow('Row and column arguments must be string numbers or numbers');
    expect(() => {
      player1.attack(player2, 7, null);
    }).toThrow('Row and column arguments must be string numbers or numbers');
    expect(() => {
      player1.attack(player2, Infinity, 'Test2');
    }).toThrow('Row and column arguments must be string numbers or numbers');
  });

  test('throws error if called with less than 3 arguments', () => {
    expect(() => {
      player1.attack(player2, 5);
    }).toThrow('Invalid arguments');

    expect(() => {
      player1.attack(player2);
    }).toThrow('Invalid arguments');

    expect(() => {
      player1.attack();
    }).toThrow('Invalid arguments');
  });
});
