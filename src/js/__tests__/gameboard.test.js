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
    }).toThrow('Row and column arguments must be string numbers or numbers');
    expect(() => {
      gameboard.getSquare(7, null);
    }).toThrow('Row and column arguments must be string numbers or numbers');
    expect(() => {
      gameboard.getSquare(Infinity, 'Test2');
    }).toThrow('Row and column arguments must be string numbers or numbers');
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
    }).toThrow('Row and column arguments must be string numbers or numbers');

    expect(() => {
      gameboard.placeShip(patrolBoat, 2, 'Test2', 'vertical');
    }).toThrow('Row and column arguments must be string numbers or numbers');

    expect(() => {
      gameboard.placeShip(patrolBoat, Infinity, 'Test2', 'vertical');
    }).toThrow('Row and column arguments must be string numbers or numbers');
  });

  test('throws error if the last argument is not one of the two directions ', () => {
    expect(() => {
      gameboard.placeShip(carrier, 2, 5, 55);
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

describe('Gameboard: placeShipsRandomly()', () => {
  let gameboard;
  const carrier = new Ship(5, 'Carrier');
  const battleship = new Ship(4, 'Battleship');
  const patrolBoat = new Ship(2, 'Patrol Boat');
  const ships = [carrier, battleship, patrolBoat];

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('places all ships from ships array', () => {
    gameboard.placeShipsRandomly(ships);
    expect(gameboard.ships.length).toBe(ships.length);
  });

  test('returns an object containing row, column, and direction properties', () => {
    const ship = [{ length: 6, name: 'Tester' }];
    const result = gameboard.placeShipsRandomly(ship);
    expect(result[0]).toHaveProperty('row');
    expect(result[0]).toHaveProperty('column');
    expect(result[0]).toHaveProperty('direction');
  });

  test.each([['row'], ['column']])(
    'returns an object whose %s property is a number',
    (property) => {
      const ship = [{ length: 6, name: 'Tester' }];
      const result = gameboard.placeShipsRandomly(ship);
      expect(typeof result[0][property]).toBe('number');
    },
  );

  test('returns an object whose direction property is "horizontal" or "vertical"', () => {
    const ship = [{ length: 6, name: 'Tester' }];
    const result = gameboard.placeShipsRandomly(ship);
    expect(['horizontal', 'vertical']).toContain(result[0].direction);
  });

  test('returns as many objects as there are ships in the array', () => {
    const result = gameboard.placeShipsRandomly(ships);
    expect(result.length).toBe(ships.length);
  });

  test('throws error if called with no arguments', () => {
    expect(() => {
      gameboard.placeShipsRandomly();
    }).toThrow('Invalid arguments');
  });

  test.each([
    ['string', 'Misza'],
    ['number', 1234],
    ['Ship instance', new Ship(4, 'Gonna Fail')],
    ['null', null],
    ['NaN', NaN],
    ['boolean', false],
  ])('throws error if the argument is not an array (%s)', (name, argument) => {
    expect(() => {
      gameboard.placeShipsRandomly(argument);
    }).toThrow('Argument must be an array');
  });

  test('throws error if the array is empty', () => {
    expect(() => {
      gameboard.placeShipsRandomly([]);
    }).toThrow('Array is empty');
  });

  test('throws error if the ships array does not contain items with length property', () => {
    const badArray = [{ name: 'This Is A Bad Ship', armor: 9000 }];
    expect(() => {
      gameboard.placeShipsRandomly(badArray);
    }).toThrow('Invalid array');
  });

  test('throws error if the ships array does not contain items with name property', () => {
    const badArray = [{ inscription: 'This Is A Bad Ship', length: 9000 }];
    expect(() => {
      gameboard.placeShipsRandomly(badArray);
    }).toThrow('Invalid array');
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
    }).toThrow('Row and column arguments must be string numbers or numbers');

    expect(() => {
      gameboard.receiveAttack(7, null);
    }).toThrow('Row and column arguments must be string numbers or numbers');

    expect(() => {
      gameboard.receiveAttack(Infinity, 'Test2');
    }).toThrow('Row and column arguments must be string numbers or numbers');
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

describe('Gameboard: isAHit()', () => {
  let gameboard = new Gameboard();
  let carrier = new Ship(5, 'Carrier');
  let patrolBoat = new Ship(2, 'Patrol Boat');
  gameboard.placeShip(carrier, 0, 0, 'horizontal');
  gameboard.placeShip(patrolBoat, 8, 9, 'vertical');

  beforeEach(() => {
    gameboard = new Gameboard();
    gameboard.placeShip(carrier, 0, 0, 'horizontal');
    gameboard.placeShip(patrolBoat, 8, 9, 'vertical');
    carrier.hits = 0;
    patrolBoat.hits = 0;
  });

  test('returns true if the previous attack is a hit', () => {
    gameboard.receiveAttack(0, 4);
    expect(gameboard.isAHit(0, 4)).toBe(true);
  });

  test('returns false if the previous attack is a miss', () => {
    gameboard.receiveAttack(5, 5);
    expect(gameboard.isAHit(5, 5)).toBe(false);
  });

  test('works for previous hits only', () => {
    gameboard.receiveAttack(0, 2);
    gameboard.receiveAttack(0, 4);
    expect(gameboard.isAHit(0, 2)).toBe(false);
  });

  test('throws error if called with less than 2 arguments', () => {
    expect(() => {
      gameboard.isAHit(1);
    }).toThrow('Invalid arguments');

    expect(() => {
      gameboard.isAHit();
    }).toThrow('Invalid arguments');
  });

  test('throws error if arguments are not string numbers or numbers', () => {
    expect(() => {
      gameboard.isAHit('Test', 5);
    }).toThrow('Row and column arguments must be string numbers or numbers');

    expect(() => {
      gameboard.isAHit(7, null);
    }).toThrow('Row and column arguments must be string numbers or numbers');

    expect(() => {
      gameboard.isAHit(Infinity, 'Test2');
    }).toThrow('Row and column arguments must be string numbers or numbers');
  });

  test.each([
    [-1, 5],
    [0, 10],
  ])('throws error if square does not exist [%i][%i]', (row, column) => {
    expect(() => {
      gameboard.isAHit(row, column);
    }).toThrow('Board square does not exist');
  });
});
