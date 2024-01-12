/* eslint no-undef: 0 */

import { Gameboard } from '../gameboard';
import { Ship } from '../ship';

describe('Gameboard: board and getSquare()', () => {
  const gameboard = new Gameboard();

  test.each([
    [0, 0, null],
    [0, 9, null],
    [9, 0, null],
    [9, 9, null],
    [4, 5, null],
  ])('board square [%i][%i] is %s', (row, column, expected) => {
    expect(gameboard.getSquare(row, column)).toBe(expected);
  });

  test.each([
    [-1, 5],
    [0, 10],
    [5, -5],
    [12, 3],
    [-1, -5],
  ])(
    'throws error when accessing non-existing square [%i][%i]',
    (row, column) => {
      expect(() => {
        gameboard.getSquare(row, column);
      }).toThrow('Board square does not exist');
    },
  );
});

describe('Gameboard: placeShip()', () => {
  let gameboard;
  const carrier = new Ship(5, 'Carrier');
  const battleship = new Ship(4, 'Battleship');
  const patrolBoat = new Ship(2, 'Patrol Boat');

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test.each([[carrier.name, 3, 5, carrier]])(
    'places %s on [%i][%i] square horizontally',
    (shipName, row, column, ship) => {
      gameboard.placeShip(ship, row, column, 'horizontal');
      for (let i = 0; i < ship.length; i++) {
        expect(gameboard.getSquare(row, column + i)).toBe(shipName);
      }
    },
  );

  test.each([[battleship.name, 0, 9, battleship]])(
    'places %s on [%i][%i] square vertically',
    (shipName, row, column, ship) => {
      gameboard.placeShip(ship, row, column, 'vertical');
      for (let i = 0; i < ship.length; i++) {
        expect(gameboard.getSquare(row + i, column)).toBe(shipName);
      }
    },
  );

  test('places multiple ships', () => {
    expect(() => {
      gameboard.placeShip(carrier, 0, 1, 'horizontal');
      gameboard.placeShip(battleship, 2, 5, 'horizontal');
      gameboard.placeShip(patrolBoat, 4, 0, 'vertical');
      gameboard.placeShip(carrier, 5, 9, 'vertical');
      gameboard.placeShip(battleship, 6, 7, 'vertical');
    }).not.toThrow();
  });

  test.each([
    [-1, 5],
    [0, 10],
    [5, -5],
    [12, 3],
    [-1, -5],
  ])(
    'throws error when coordinates are illegal for 10x10 board [%i][%i]',
    (row, column) => {
      expect(() => {
        gameboard.placeShip(patrolBoat, row, column, 'horizontal');
      }).toThrow('Board square does not exist');
    },
  );

  test.each([
    [carrier.name, 0, 6, carrier],
    [carrier.name, 1, 7, carrier],
    [carrier.name, 2, 8, carrier],
    [carrier.name, 3, 9, carrier],
  ])(
    'throws error when %s does not fit horizontally [%i][%i]',
    (shipName, row, column, ship) => {
      expect(() => {
        gameboard.placeShip(ship, row, column, 'horizontal');
      }).toThrow('Invalid ship placement: Ship does not fit');
    },
  );

  test.each([
    [battleship.name, 7, 0, battleship],
    [battleship.name, 8, 1, battleship],
    [battleship.name, 9, 2, battleship],
  ])(
    'throws error when %s does not fit vertically [%i][%i]',
    (shipName, row, column, ship) => {
      expect(() => {
        gameboard.placeShip(ship, row, column, 'vertical');
      }).toThrow('Invalid ship placement: Ship does not fit');
    },
  );

  test('throws error when ships would overlap', () => {
    expect(() => {
      gameboard.placeShip(battleship, 0, 2, 'horizontal');
      gameboard.placeShip(patrolBoat, 0, 5, 'vertical');
    }).toThrow('Invalid ship placement: Ships cannot overlap');
    expect(() => {
      gameboard.placeShip(carrier, 5, 5, 'vertical');
      gameboard.placeShip(patrolBoat, 9, 5, 'horizontal');
    }).toThrow('Invalid ship placement: Ships cannot overlap');
  });

  test('throws error when ships would be adjacent', () => {
    expect(() => {
      gameboard.placeShip(carrier, 2, 0, 'horizontal');
      gameboard.placeShip(patrolBoat, 3, 2, 'horizontal');
    }).toThrow('Invalid ship placement: Ships cannot be adjacent');
    expect(() => {
      gameboard.placeShip(battleship, 5, 9, 'vertical');
      gameboard.placeShip(patrolBoat, 3, 8, 'vertical');
    }).toThrow('Invalid ship placement: Ships cannot be adjacent');
  });
});

describe('Gameboard: receiveAttack()', () => {
  let gameboard;
  const carrier = new Ship(5, 'Carrier');
  const battleship = new Ship(4, 'Battleship');
  const destroyer = new Ship(3, 'Destroyer');
  const submarine = new Ship(3, 'Submarine');
  const patrolBoat = new Ship(2, 'Patrol Boat');

  // Make sure the gameboard instance is cleared before tests
  beforeEach(() => {
    gameboard = new Gameboard();
  });
});
