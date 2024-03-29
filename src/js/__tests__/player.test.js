/* eslint no-undef: 0 */

import { Player, ComputerPlayer } from '../player';
import { Ship } from '../ship';

describe('Player', () => {
  beforeEach(() => {
    Player.count = 0;
  });
  
  test('creates default human player if no name given', () => {
    expect(new Player().name).toBe('Player 1');
  });

  test('creates default human player if empty string given', () => {
    expect(new Player('').name).toBe('Player 1');
  });

  test('creates default human players with incrementing player number', () => {
    const player1 = new Player();
    const player2 = new Player('');
    expect(player1.name).toBe('Player 1');
    expect(player2.name).toBe('Player 2');
  });

  test.each([['Ron'], ['Harry'], ['Hermione']])(
    'creates human player with name if name given (%s)',
    (name) => {
      expect(new Player(name).name).toBe(name);
    },
  );

  test.each([[null], [undefined], [Infinity], [NaN], [1992]])(
    'converts name argument to string (%s)',
    (name) => {
      expect(typeof new Player(name).name).toBe('string');
    },
  );

  test('contains isHuman property, whose value is true', () => {
    expect(new Player()).toHaveProperty('isHuman', true);
  });

  test('contains turn property, whose value is false', () => {
    expect(new Player()).toHaveProperty('turn', false);
  });

  test('contains attacks property, whose value is 0', () => {
    expect(new Player()).toHaveProperty('attacks', 0);
  });

  test('contains health property, whose value is 100', () => {
    expect(new Player()).toHaveProperty('health', 100);
  });
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

  test('has name property whose value is "Computer"', () => {
    expect(new ComputerPlayer().name).toBe('Computer');
  });

  test('has name property whose value is "Smarter Computer" if true passed as an argument', () => {
    expect(new ComputerPlayer(true).name).toBe('Smarter Computer');
  });

  test('throws error if something else is passed as an argument', () => {
    expect(() => {
      new ComputerPlayer('Even Smarter AI');
    }).toThrow('Invalid argument');
  });

  test('contains isHuman property, whose value is false', () => {
    expect(new ComputerPlayer()).toHaveProperty('isHuman', false);
  });

  test('contains turn property, whose value is false', () => {
    expect(new ComputerPlayer()).toHaveProperty('turn', false);
  });

  test('contains attacks property, whose value is 0', () => {
    expect(new ComputerPlayer()).toHaveProperty('attacks', 0);
  });

  test('contains health property, whose value is 100', () => {
    expect(new ComputerPlayer()).toHaveProperty('health', 100);
  });
});

describe('ComputerPlayer: attack()', () => {
  let player;
  let computerPlayer;
  let carrier;
  let battleship;
  let destroyer;
  let submarine;
  let patrolBoat;

  beforeEach(() => {
    player = new Player('Player 1');
    computerPlayer = new ComputerPlayer();
    carrier = new Ship(5, 'Carrier');
    battleship = new Ship(4, 'Battleship');
    destroyer = new Ship(3, 'Destroyer');
    submarine = new Ship(3, 'Submarine');
    patrolBoat = new Ship(2, 'Patrol Boat');
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
  });

  test('works as expected (50 moves)', () => {
    for (let i = 0; i < 50; i++) {
      computerPlayer.attack(player);
    }
    const attacks = player.board.hits.length + player.board.misses.length;
    expect(attacks).toBe(50);
  });

  test('returns attacked square (row and column)', () => {
    const result = computerPlayer.attack(player);
    let row = 0;
    let column = 0;
    if (player.board.hits.length === 1) {
      row = player.board.hits[0][0];
      column = player.board.hits[0][1];
    } else {
      row = player.board.misses[0][0];
      column = player.board.misses[0][1];
    }
    expect(result).toEqual([row, column]);
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

describe('ComputerPlayer: smarter attack()', () => {
  const player = new Player('Player 1');
  const computerPlayer = new ComputerPlayer(true);
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

  test('attacks vertically or horizontally adjacent square if previous attack was a hit', () => {
    do {
      computerPlayer.attack(player);
    } while (player.board.hits.length !== 1);
    const row = player.board.hits[0][0];
    const column = player.board.hits[0][1];
    computerPlayer.attack(player);
    let nextRow = 0;
    let nextColumn = 0;
    if (player.board.hits.length === 2) {
      nextRow = player.board.hits[1][0];
      nextColumn = player.board.hits[1][1];
    } else {
      nextRow = player.board.misses[player.board.misses.length - 1][0];
      nextColumn = player.board.misses[player.board.misses.length - 1][1];
    }
    let rowCheckPassed = false;
    let columnCheckPassed = false;
    if (nextRow === row - 1 || nextRow === row || nextRow === row + 1) {
      rowCheckPassed = true;
    }
    if (
      nextColumn === column - 1 ||
      nextColumn === column ||
      nextColumn === column + 1
    ) {
      columnCheckPassed = true;
    }
    expect(rowCheckPassed).toBe(true);
    expect(columnCheckPassed).toBe(true);
  });
});

describe('Player/ComputerPlayer: calculateAccuracy()', () => {
  let player;
  let computerPlayer;
  const battleship = new Ship(4, 'Battleship');
  const destroyer = new Ship(3, 'Destroyer');
  const submarine = new Ship(3, 'Submarine');

  beforeEach(() => {
    player = new Player('Player 1');
    computerPlayer = new ComputerPlayer(true);
    player.board.placeShip(battleship, 2, 5, 'horizontal');
    player.board.placeShip(destroyer, 4, 0, 'horizontal');
    player.board.placeShip(submarine, 6, 7, 'horizontal');
    computerPlayer.board.placeShip(battleship, 2, 0, 'horizontal');
    computerPlayer.board.placeShip(destroyer, 4, 0, 'horizontal');
    computerPlayer.board.placeShip(submarine, 5, 7, 'horizontal');
    battleship.hits = 0;
    destroyer.hits = 0;
    submarine.hits = 0;
  });

  test('works as expected (100% accuracy)', () => {
    player.attack(computerPlayer, 2, 0);
    player.attack(computerPlayer, 2, 1);
    player.attack(computerPlayer, 2, 2);
    player.attack(computerPlayer, 2, 3);
    player.attack(computerPlayer, 4, 0);
    player.attack(computerPlayer, 4, 1);
    player.attack(computerPlayer, 4, 2);
    player.attack(computerPlayer, 5, 7);
    player.attack(computerPlayer, 5, 8);
    player.attack(computerPlayer, 5, 9);
    player.attacks = 10;
    expect(player.calculateAccuracy(computerPlayer)).toBe(100);
  });

  test('works as expected (50% accuracy)', () => {
    player.attack(computerPlayer, 2, 0);
    player.attack(computerPlayer, 2, 1);
    player.attack(computerPlayer, 2, 2);
    player.attack(computerPlayer, 2, 3);
    player.attack(computerPlayer, 4, 0);
    player.attack(computerPlayer, 5, 0);
    player.attack(computerPlayer, 5, 1);
    player.attack(computerPlayer, 5, 2);
    player.attack(computerPlayer, 5, 3);
    player.attack(computerPlayer, 5, 4);
    player.attacks = 10;
    expect(player.calculateAccuracy(computerPlayer)).toBe(50);
  });

  test('works as expected (0% accuracy)', () => {
    player.attack(computerPlayer, 3, 0);
    player.attack(computerPlayer, 3, 1);
    player.attack(computerPlayer, 3, 2);
    player.attack(computerPlayer, 3, 3);
    player.attack(computerPlayer, 3, 4);
    player.attack(computerPlayer, 5, 0);
    player.attack(computerPlayer, 5, 1);
    player.attack(computerPlayer, 5, 2);
    player.attack(computerPlayer, 5, 3);
    player.attack(computerPlayer, 5, 4);
    player.attacks = 10;
    expect(player.calculateAccuracy(computerPlayer)).toBe(0);
  });
});
