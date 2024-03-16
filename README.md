RSA FlipIt - The Game of Stealthy Takeover
======

This repo contains a javascript implementation of flipIt the game of stealthy takeover. 
As of March 2024 this is the 2nd computer implementation of the game... and is based on the first implementation of the game by Ethan Heilman (https://www.ethanheilman.com). The javascript game code is largely taken from Ethan's implementation with some additions by myself. The page now allows to select various strategies and costs/benefits including separate costs for reveal and flip.

FlipIt was invented by Marten van Dijk, Ari Juels, Alina Oprea, and Ronald L. Rivest in the paper [FLIPIT: The Game of “Stealthy Takeover”](https://eprint.iacr.org/2012/103).

FlipIt was developed to model [Advanced Persistent Threats](https://en.wikipedia.org/wiki/Advanced_persistent_threat) and other strategic games of limited information.
For example flipIt is very similar to the situations faced by [spy agencies](https://en.wikipedia.org/wiki/Clandestine_HUMINT) and [insurgent 
networks](https://en.wikipedia.org/wiki/Guerrilla_warfare) in which members of a network may have been flipped by an enemy network, double crossing the network. 
Such betrayals remain unknown to the network until the network actively and at high cost either launches an investigation or flips an enemy agent to learn which friendly agents have been flipped. 


Start Playing Now
-----------------

Click [here](https://ethanheilman.github.io/flipIt/flipit.html) to play flipIt against the computer or let the computer play against itself.
Contains detailed instructions on the rules of the game.


How to Play
----------------

Flip it is played by two players, X and Y (red and blue). 
The object of the game is to score as many points as possible.
Players score points for every second they control the board.
The only action that either player can perform is to 'flip'.
Each flip action costs the flipping player points. 
If a player chooses to flip and they are in control of the board then they stay in control of the board.
Player X always starts the game in control of the board.
If on the other hand a player is not in control of the board then when they flip they will gain control of the board.
Players only learn the state of the board when they flip.


Rules For Human vs Computer Games.
--------

### Basic

You are playing as the blue player.
While you, the blue player, always start in control the red player can play a flip and gain control at any time.
The state of the board is obscured in grey.
You and the red player only learn the state of the game by playing 'flip'.
You can gain control by playing 'flip'.
The game ends after 10 seconds.

    
### How to Win
        
The object of the game is to win as many points as possible.
To win you want to be in control for as long as possible using as few flips as possible.
        

### Points

A player gains 100 points per second that that player is in control.

A player loses 100 points when that player plays 'flip'.


### Moves

The only move available to either the red or the blue player is to play 'flip'.
If you are in control and you play 'flip' you remain in control.
If you are not in control and you play 'flip' you regain control.
One on player can be in control at a time.


### The Board

The board displays the current known information about the game.
Each 'flip' played is marked with a circle.
You can only see information that was revealed by your flips.
The scores are updated when you play a 'flip' and reveal the current state of the game.
Blue rectangles represent periods of time in which you, the blue player, had control. 
Red rectangles represent periods of time in which the red player was in control.
The score is given in the upper right hand corner.
