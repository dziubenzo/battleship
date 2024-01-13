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

  test('pushes ships to ships array', () => {
    gameboard.placeShip(carrier, 0, 1, 'horizontal');
    gameboard.placeShip(battleship, 2, 5, 'horizontal');
    gameboard.placeShip(patrolBoat, 4, 0, 'vertical');
    gameboard.placeShip(carrier, 5, 9, 'vertical');
    gameboard.placeShip(battleship, 6, 7, 'vertical');
    expect(gameboard.ships).toHaveLength(5);
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
  const gameboard = new Gameboard();
  const carrier = new Ship(5, 'Carrier');
  const battleship = new Ship(4, 'Battleship');
  const destroyer = new Ship(3, 'Destroyer');
  const submarine = new Ship(3, 'Submarine');
  const patrolBoat = new Ship(2, 'Patrol Boat');
  gameboard.placeShip(carrier, 0, 1, 'horizontal');
  gameboard.placeShip(battleship, 2, 5, 'horizontal');
  gameboard.placeShip(destroyer, 4, 0, 'horizontal');
  gameboard.placeShip(submarine, 6, 7, 'horizontal');
  gameboard.placeShip(patrolBoat, 9, 2, 'horizontal');
  const shipsCoordinates = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [2, 5],
    [2, 6],
    [2, 7],
    [2, 8],
    [4, 0],
    [4, 1],
    [4, 2],
    [6, 7],
    [6, 8],
    [6, 9],
    [9, 2],
    [9, 3],
  ];

  beforeEach(() => {
    gameboard.hits = [];
    gameboard.misses = [];
    gameboard.ships[0] = new Ship(5, 'Carrier');
    gameboard.ships[1] = new Ship(4, 'Battleship');
    gameboard.ships[2] = new Ship(3, 'Destroyer');
    gameboard.ships[3] = new Ship(3, 'Submarine');
    gameboard.ships[4] = new Ship(2, 'Patrol Boat');
  });

  test.each([
    [gameboard.ships[0].name, gameboard.ships[0], 0, 1],
    [gameboard.ships[1].name, gameboard.ships[1], 2, 8],
    [gameboard.ships[2].name, gameboard.ships[2], 4, 1],
    [gameboard.ships[3].name, gameboard.ships[3], 6, 9],
    [gameboard.ships[4].name, gameboard.ships[4], 9, 3],
  ])('calls ship.hit() for %s', (shipName, ship, row, column) => {
    gameboard.receiveAttack(row, column);
    expect(ship.hits).toBe(1); // ship.hits gives 0, but when ship.hits is replaced with gameboard.ships[0-4].hits, it gives 1, so code works, but tests fail
  });

  test('records hits', () => {
    gameboard.receiveAttack(0, 1);
    gameboard.receiveAttack(2, 5);
    gameboard.receiveAttack(4, 0);
    gameboard.receiveAttack(6, 7);
    gameboard.receiveAttack(9, 2);
    expect(gameboard.hits).toEqual([
      [0, 1],
      [2, 5],
      [4, 0],
      [6, 7],
      [9, 2],
    ]);
  });

  test('records misses', () => {
    gameboard.receiveAttack(0, 8);
    gameboard.receiveAttack(2, 2);
    gameboard.receiveAttack(4, 6);
    gameboard.receiveAttack(6, 3);
    gameboard.receiveAttack(8, 8);
    expect(gameboard.misses).toEqual([
      [0, 8],
      [2, 2],
      [4, 6],
      [6, 3],
      [8, 8],
    ]);
  });

  test.each([
    [-1, 5],
    [0, 10],
  ])('throws error if square does not exist [%i][%i]', (row, column) => {
    expect(() => {
      gameboard.receiveAttack(row, column);
    }).toThrow('Board square does not exist');
  });

  test.each([
    ['hits', 4, 0],
    ['misses', 0, 9],
  ])(
    'throws error if the same square is attacked twice (%s)',
    (scenario, row, column) => {
      expect(() => {
        gameboard.receiveAttack(row, column);
        gameboard.receiveAttack(row, column);
      }).toThrow('Invalid attack');
    },
  );

  test('sinks ships', () => {
    for (let i = 0; i < gameboard.ships[0].length; i++) {
      const row = shipsCoordinates[i][0];
      const column = shipsCoordinates[i][1];
      gameboard.receiveAttack(row, column);
    }
    expect(gameboard.ships[0].isSunk()).toBe(true);
  });

  test('calls allShipsSunk() if all ships are sunk', () => {
    for (const coordinates of shipsCoordinates) {
      const row = coordinates[0];
      const column = coordinates[1];
      gameboard.receiveAttack(row, column);
    }
    expect(gameboard.allShipsSunk()).toHaveBeenCalled();
  });
});
