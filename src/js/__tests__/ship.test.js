/* eslint no-undef: 0 */

import { Ship } from '../ship';

// Ship class tests
describe('Ship', () => {
  test('Creates proper Ship objects', () => {
    expect(new Ship(5, 'Carrier')).toEqual({
      length: 5,
      name: 'Carrier',
      hits: 0,
    });
  });

  test('Converts string numbers to numbers', () => {
    expect(new Ship('2', 'Patrol Boat').length).toBe(2);
  });

  test('throws error if called with less than 2 arguments', () => {
    expect(() => {
      new Ship(5);
    }).toThrow('Invalid arguments');
    expect(() => {
      new Ship();
    }).toThrow('Invalid arguments');
  });

  test.each([['PatrolBoat'], [null], [undefined]])(
    'Throws error when length is %s',
    (value) => {
      expect(() => {
        new Ship(value, 'Patrol Boat');
      }).toThrow('Length must be a number');
    },
  );

  test.each([[0], [11], [-6], [23]])(
    'Throws error when length is not in the range of 1-10 (%i)',
    (length) => {
      expect(() => {
        new Ship(length, 'Fun Ship');
      }).toThrow('Invalid length');
    },
  );

  test('Throws error when length is not an integer', () => {
    expect(() => {
      new Ship(2.4, 'Patrol Boat+');
    }).toThrow('Length must be an integer');
  });

  test('Throws error when name is not a string', () => {
    expect(() => {
      new Ship(5, 5);
    }).toThrow('Name must be a string');
  });

  test('isSunk() evaluates to false when ship is instantiated', () => {
    expect(new Ship(5, 'Carrier').isSunk()).toBe(false);
  });

  test('hit() increases hits', () => {
    const ship = new Ship(3, 'Cruiser');
    ship.hit();
    ship.hit();
    expect(ship.hits).toBe(2);
  });

  test('hit() throws error when hits exceed length', () => {
    expect(() => {
      const ship = new Ship(2, 'Cruiser');
      ship.hit();
      ship.hit();
      ship.hit();
    }).toThrow('The ship has already sunk!');
  });

  test('isSunk() evaluates to true if hits === length', () => {
    const ship = new Ship(2, 'Cruiser');
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});
