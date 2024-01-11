/* eslint no-undef: 0 */

import { Ship } from '../ship';

// Ship class tests
describe('Ship', () => {
  test('Creates proper ship objects', () => {
    expect(new Ship(5, 'Carrier')).toEqual({
      length: 5,
      name: 'Carrier',
      hits: 0,
      isSunk: false,
    });
    expect(new Ship(2, 'Patrol Boat')).toEqual({
      length: 2,
      name: 'Patrol Boat',
      hits: 0,
      isSunk: false,
    });
  });
  test('Converts numbers as strings to numbers', () => {
    expect(new Ship('2', 'Patrol Boat')).toEqual({
      length: 2,
      name: 'Patrol Boat',
      hits: 0,
      isSunk: false,
    });
  });
  test('Throws error when length is not a number', () => {
    expect(() => {
      new Ship('PatrolBoat', 'Patrol Boat');
    }).toThrow();
  });
  test('isSunk evaluates to false when ship is instantiated', () => {
    expect(new Ship(5, 'Carrier').isSunk).toBe(false);
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
    }).toThrow("The ship has already sunk!");
  });
  test('isSunk evaluates to true is hits === length', () => {
    const ship = new Ship(2, 'Cruiser');
    ship.hit();
    ship.hit();
    expect(ship.isSunk).toBe(true);
  });
});
