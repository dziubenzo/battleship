/* eslint no-undef: 0 */

import { Gameboard } from '../gameboard';

// Gameboard class tests
describe('Gameboard', () => {
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
