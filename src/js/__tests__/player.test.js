/* eslint no-undef: 0 */

import { Player } from '../player';

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