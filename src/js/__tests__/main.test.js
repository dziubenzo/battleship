/* eslint no-undef: 0 */

// Ship class tests
describe('Ship class tests', () => {
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
    expect(new Ship('PatrolBoat', 'Patrol Boat')).toThrow();
  });
});
