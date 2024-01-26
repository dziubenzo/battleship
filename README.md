# Odin Project - Battleship

![Gameplay](.//src/assets/gameplay.png 'Gameplay')

The Battleship game with customisation, support for 2 human players, 2 computer levels, event log and much more!

The implementation prevents placing ships next to each other and lets the player play another move if they hit a ship.

## Features

- Play against a friend, a normal computer player or a smarter computer player
- See your and your opponent's current health
- Change ship names and length, computer move speed or default human player names with localStorage support
- Restore settings to default if you get lost
- Place ships manually in both directions or click the Place Ships Randomly button to place them automatically as many times as you wish
- Event log, which reports every move and ships sunk
- View game stats after the game is over
- Two themes to choose from with localStorage support
- Support for small-width devices

## Tips

- Press the **scroll wheel** to rotate a ship or use the icon on the right
- When placing ships on mobile, **tap and hold the square** for a second or so to see ship preview (the ship will be **grey**)
- Save options also by pressing **Enter**
- Close the game over modal by pressing **Esc**
- Close the options modal and pass device modal also by pressing **Esc**
- Computer move speed range: **0-5000**
- Ship length range: **1-10** (makes sense, right?)
