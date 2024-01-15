/* eslint no-undef: 0 */

import { Player, ComputerPlayer } from '../player';
import { Ship } from '../ship';

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

describe('Player: attack()', () => {
  const player1 = new Player('Player 1');
  const player2 = new Player('Player 2');
  const carrier = new Ship(5, 'Carrier');
  const battleship = new Ship(4, 'Battleship');
  const destroyer = new Ship(3, 'Destroyer');
  const submarine = new Ship(3, 'Submarine');
  const patrolBoat = new Ship(2, 'Patrol Boat');
  player1.board.placeShip(carrier, 0, 1, 'horizontal');
  player1.board.placeShip(battleship, 2, 5, 'horizontal');
  player1.board.placeShip(destroyer, 4, 0, 'horizontal');
  player1.board.placeShip(submarine, 6, 7, 'horizontal');
  player1.board.placeShip(patrolBoat, 9, 2, 'horizontal');
  player2.board.placeShip(carrier, 0, 5, 'horizontal');
  player2.board.placeShip(battleship, 2, 0, 'horizontal');
  player2.board.placeShip(destroyer, 4, 0, 'horizontal');
  player2.board.placeShip(submarine, 5, 7, 'horizontal');
  player2.board.placeShip(patrolBoat, 7, 8, 'horizontal');

  test.each([
    ['hit', player2.board.hits, player2, 0, 7],
    ['miss', player2.board.misses, player2, 2, 8],
  ])(
    "registers a %s on opponent's board",
    (scenario, array, opponent, row, column) => {
      player1.attack(opponent, row, column);
      expect(array).toHaveLength(1);
      expect(array).toEqual([[row, column]]);
    },
  );

  test.each([
    ['hit', player1.board.hits, player1, 0, 1],
    ['miss', player1.board.misses, player1, 4, 8],
  ])(
    'works the other way around (%s)',
    (scenario, array, opponent, row, column) => {
      player2.attack(opponent, row, column);
      expect(array).toHaveLength(1);
      expect(array).toEqual([[row, column]]);
    },
  );

  test('throws error if called with less than 3 arguments', () => {
    expect(() => {
      player1.attack(player2, 5);
    }).toThrow('Invalid arguments');

    expect(() => {
      player1.attack(player2);
    }).toThrow('Invalid arguments');

    expect(() => {
      player1.attack();
    }).toThrow('Invalid arguments');
  });

  test('throws error if the first argument is not Player/ComputerPlayer instance', () => {
    expect(() => {
      player1.attack('Attack With All Force!', 0, 0);
    }).toThrow(
      'The first argument must be an instance of Player/ComputerPlayer class',
    );
  });

  test('throws error if row or column is not a string number or a number', () => {
    expect(() => {
      player1.attack(player2, 'Test', 0);
    }).toThrow('Row and column arguments must be string numbers or numbers');
    expect(() => {
      player1.attack(player2, 7, null);
    }).toThrow('Row and column arguments must be string numbers or numbers');
    expect(() => {
      player1.attack(player2, Infinity, 'Test2');
    }).toThrow('Row and column arguments must be string numbers or numbers');
  });

  test('throws error if targets the attacker', () => {
    expect(() => {
      player1.attack(player1, 5, 4);
    }).toThrow('You cannot attack yourself');
  });
});

describe('ComputerPlayer', () => {
  test('creates normal computer player if no argument given', () => {
    expect(new ComputerPlayer().isSmart).toBe(false);
  });

  test('creates smarter computer player if true passed as an argument', () => {
    expect(new ComputerPlayer(true).isSmart).toBe(true);
  });

  test('throws error if something else is passed as an argument', () => {
    expect(() => {
      new ComputerPlayer('Even Smarter AI');
    }).toThrow('Invalid argument');
  });
});

describe('ComputerPlayer: attack()', () => {
  const player = new Player('Player 1');
  const computerPlayer = new ComputerPlayer();
  const carrier = new Ship(5, 'Carrier');
  const battleship = new Ship(4, 'Battleship');
  const destroyer = new Ship(3, 'Destroyer');
  const submarine = new Ship(3, 'Submarine');
  const patrolBoat = new Ship(2, 'Patrol Boat');
  player.board.placeShip(carrier, 0, 1, 'horizontal');
  player.board.placeShip(battleship, 2, 5, 'horizontal');
  player.board.placeShip(destroyer, 4, 0, 'horizontal');
  player.board.placeShip(submarine, 6, 7, 'horizontal');
  player.board.placeShip(patrolBoat, 9, 2, 'horizontal');
  computerPlayer.board.placeShip(carrier, 0, 5, 'horizontal');
  computerPlayer.board.placeShip(battleship, 2, 0, 'horizontal');
  computerPlayer.board.placeShip(destroyer, 4, 0, 'horizontal');
  computerPlayer.board.placeShip(submarine, 5, 7, 'horizontal');
  computerPlayer.board.placeShip(patrolBoat, 7, 8, 'horizontal');

  test('works as expected (50 moves)', () => {
    for (let i = 0; i < 50; i++) {
      computerPlayer.attack(player);
    }
    const attacks = player.board.hits.length + player.board.misses.length;
    expect(attacks).toBe(50);
  });

  test('throws error if called with no arguments', () => {
    expect(() => {
      computerPlayer.attack();
    }).toThrow('Invalid arguments');
  });

  test('throws error if the argument is not Player/ComputerPlayer instance', () => {
    expect(() => {
      computerPlayer.attack(Infinity);
    }).toThrow(
      'The argument must be an instance of Player/ComputerPlayer class',
    );
  });

  test('throws error if targets the attacker', () => {
    expect(() => {
      computerPlayer.attack(computerPlayer);
    }).toThrow('Computer cannot attack itself');
  });
});
