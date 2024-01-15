/* eslint no-undef: 0 */

import { Gameboard } from '../gameboard';
import { Ship } from '../ship';

describe('Gameboard: instance and getSquare()', () => {
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

  test('throws error if instantiated with any arguments', () => {
    expect(() => {
      new Gameboard('Fun Gameboard');
    }).toThrow('Gameboard is instantiated without any arguments');
  });

  test('getSquare() converts string numbers to numbers', () => {
    expect(() => {
      gameboard.getSquare('2', '7');
    }).not.toThrow();
  });

  test('throws error if getSquare() is called with less than 2 arguments', () => {
    expect(() => {
      gameboard.getSquare(5);
    }).toThrow('Invalid arguments');
    expect(() => {
      gameboard.getSquare();
    }).toThrow('Invalid arguments');
  });

  test('throws error if getSquare() arguments are not string numbers or numbers', () => {
    expect(() => {
      gameboard.getSquare('Test', 5);
    }).toThrow('Arguments must be string numbers or numbers');
    expect(() => {
      gameboard.getSquare(7, null);
    }).toThrow('Arguments must be string numbers or numbers');
    expect(() => {
      gameboard.getSquare(Infinity, 'Test2');
    }).toThrow('Arguments must be string numbers or numbers');
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

  test('throws error if called with less than 4 arguments', () => {
    expect(() => {
      gameboard.placeShip(patrolBoat, 2, 5);
    }).toThrow('Invalid arguments');

    expect(() => {
      gameboard.placeShip(2, 5);
    }).toThrow('Invalid arguments');

    expect(() => {
      gameboard.placeShip(carrier);
    }).toThrow('Invalid arguments');

    expect(() => {
      gameboard.placeShip();
    }).toThrow('Invalid arguments');
  });

  test('throws error if the first argument is not Ship instance', () => {
    expect(() => {
      gameboard.placeShip('Patrol Boat', 2, 5, 'vertical');
    }).toThrow('The first argument must be an instance of Ship class');
  });

  test('throws error if row or column is not a string number or a number', () => {
    expect(() => {
      gameboard.placeShip(patrolBoat, 'Test', 5, 'vertical');
    }).toThrow('The first argument must be an instance of Ship class');

    expect(() => {
      gameboard.placeShip(patrolBoat, 2, 'Test2', 'vertical');
    }).toThrow('The first argument must be an instance of Ship class');
  });

  test('throws error if the last argument is not one of the two directions ', () => {
    expect(() => {
      gameboard.placeShip('Patrol Boat', 2, 5, 55);
    }).toThrow("Direction argument must be 'horizontal' or 'vertical'");
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

describe('Gameboard: receiveAttack() and areAllShipsSunk()', () => {
  let gameboard = new Gameboard();
  let carrier = new Ship(5, 'Carrier');
  let battleship = new Ship(4, 'Battleship');
  let destroyer = new Ship(3, 'Destroyer');
  let submarine = new Ship(3, 'Submarine');
  let patrolBoat = new Ship(2, 'Patrol Boat');
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
    gameboard = new Gameboard();
    gameboard.placeShip(carrier, 0, 1, 'horizontal');
    gameboard.placeShip(battleship, 2, 5, 'horizontal');
    gameboard.placeShip(destroyer, 4, 0, 'horizontal');
    gameboard.placeShip(submarine, 6, 7, 'horizontal');
    gameboard.placeShip(patrolBoat, 9, 2, 'horizontal');
    // Resets ship hits for test.each to work properly (test.each references test objects created not here, but in code right below the describe() block)
    carrier.hits = 0;
    battleship.hits = 0;
    destroyer.hits = 0;
    submarine.hits = 0;
    patrolBoat.hits = 0;
  });

  test('converts string numbers to numbers', () => {
    expect(() => {
      gameboard.receiveAttack('2', '7');
    }).not.toThrow();
  });

  test.each([
    [gameboard.ships[0].name, gameboard.ships[0], 0, 1],
    [gameboard.ships[1].name, gameboard.ships[1], 2, 8],
    [gameboard.ships[2].name, gameboard.ships[2], 4, 1],
    [gameboard.ships[3].name, gameboard.ships[3], 6, 9],
    [gameboard.ships[4].name, gameboard.ships[4], 9, 3],
  ])('calls ship.hit() for %s', (shipName, ship, row, column) => {
    gameboard.receiveAttack(row, column);
    expect(ship.hits).toBe(1);
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

  test('throws error if called with less than 2 arguments', () => {
    expect(() => {
      gameboard.receiveAttack(1);
    }).toThrow('Invalid arguments');

    expect(() => {
      gameboard.receiveAttack();
    }).toThrow('Invalid arguments');
  });

  test('throws error if arguments are not string numbers or numbers', () => {
    expect(() => {
      gameboard.receiveAttack('Test', 5);
    }).toThrow('Arguments must be string numbers or numbers');
    expect(() => {
      gameboard.receiveAttack(7, null);
    }).toThrow('Arguments must be string numbers or numbers');
    expect(() => {
      gameboard.receiveAttack(Infinity, 'Test2');
    }).toThrow('Arguments must be string numbers or numbers');
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

  test('areAllShipsDown() returns false if there are ships on the board', () => {
    for (let i = 0; i < gameboard.ships[0].length; i++) {
      const row = shipsCoordinates[i][0];
      const column = shipsCoordinates[i][1];
      gameboard.receiveAttack(row, column);
    }
    gameboard.receiveAttack(4, 1);
    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(4, 2);
    gameboard.receiveAttack(9, 9);
    gameboard.receiveAttack(9, 3);
    expect(gameboard.areAllShipsDown()).toBe(false);
  });

  test('areAllShipsDown() returns true if all ships have been sunk', () => {
    for (const coordinates of shipsCoordinates) {
      const row = coordinates[0];
      const column = coordinates[1];
      gameboard.receiveAttack(row, column);
    }
    expect(gameboard.areAllShipsDown()).toBe(true);
  });
});
