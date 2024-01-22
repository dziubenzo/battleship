/* eslint no-undef: 0 */

import { EventLog } from '../eventLog';
import { ComputerPlayer, Player } from '../player';

describe('EventLog', () => {
  const player1 = new Player('Misza');
  const player2 = new ComputerPlayer();

  test('has player1 property', () => {
    expect(new EventLog(player1, player2)).toHaveProperty('player1');
  });

  test('has player2 property', () => {
    expect(new EventLog(player1, player2)).toHaveProperty('player2');
  });

  test("has moves property equal to the sum of players' attacks properties", () => {
    const expected = player1.attacks + player2.attacks;
    expect(new EventLog(player1, player2)).toHaveProperty('moves', expected);
  });

  test('throws error if called with less than 2 arguments', () => {
    expect(() => {
      new EventLog(player1);
    }).toThrow('Invalid arguments');

    expect(() => {
      new EventLog();
    }).toThrow('Invalid arguments');
  });

  test('throws error if either argument is not an instance of Player/ComputerPlayer', () => {
    expect(() => {
      new EventLog('badString', player2);
    }).toThrow(
      'Both arguments must be an instance of Player/ComputerPlayer class',
    );
    expect(() => {
      new EventLog(player1, 6999);
    }).toThrow(
      'Both arguments must be an instance of Player/ComputerPlayer class',
    );
  });
});

describe('EventLog: updateMoves()', () => {
  const player1 = new Player();
  const player2 = new ComputerPlayer();
  const eventLog = new EventLog(player1, player2);

  test('works as expected', () => {
    player1.attacks++;
    player2.attacks++;
    player1.attacks++;
    const expected = player1.attacks + player2.attacks;
    eventLog.updateMoves();
    expect(eventLog.moves).toBe(expected);
  });
});

describe('EventLog: getCoordinates()', () => {
  const player1 = new Player();
  const player2 = new ComputerPlayer();
  const eventLog = new EventLog(player1, player2);

  test.each([
    [1, 2, 'B3'],
    [5, 5, 'F6'],
    [0, 0, 'A1'],
    [9, 9, 'J10'],
  ])('works as expected [%i][%i]', (row, column, expected) => {
    expect(eventLog.getCoordinates(row, column)).toBe(expected);
  });

  test('throws error if called with less than 2 arguments', () => {
    expect(() => {
      eventLog.getCoordinates('test');
    }).toThrow('Invalid arguments');

    expect(() => {
      eventLog.getCoordinates();
    }).toThrow('Invalid arguments');
  });
});
