flipIt - The Game of Stealthy Takeover
======

This repo contains a javascript implementation of flipIt the game of stealthy takeover. 
As of July 2012 this is the only computer implementation of the game.
FlipIt was invented by Marten van Dijk, Ari Juels, Alina Oprea, and Ronald L. Rivest in the paper [FLIPIT: The Game of “Stealthy Takeover”](http://www.rsa.com/rsalabs/presentations/Flipit.pdf).

FlipIt was developed to model [Advanced Persistent Threats](http://en.wikipedia.org/wiki/Advanced_persistent_threat) 
 or [APTs](http://www.rsa.com/rsalabs/node.asp?id=3911) and other strategic games of limited information.
For example flipIt is very similar to the situations faced by [spy agencies](http://en.wikipedia.org/wiki/Clandestine_HUMINT) and [insurgent 
networks](http://en.wikipedia.org/wiki/Guerrilla_warfare) in which members of a network may have been flipped by an enemy network, double crossing the network. 
Such betrayals remain unknown to the network until the network actively and at high cost either launches an investigation or flips an enemy agent to learn which friendly agents have been flipped. 


Start Playing Now
-----------------

Click [here](http://ethanheilman.github.com/flipIt/playable_with_instructions.html) to play flipIt against the computer.
Contains detailed instructions on the rules of the game.
Note: Certain versions of IE do not support HTML5 or the canvas element which will break the game. If game appears broken use Chrome or Firefox.


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

Flip It Notation Rendering
----------------

This javascript library can generate a visualization of flip game from a list of moves. To generate the visualization visit the following url with the moves appended to the end of the url.

[http://ethanheilman.github.com/flipIt/drawgame.html?flips=100:X,200:Y,300:Y,400:X,450:Y,650:Y,670:X,800:Y,900:X](http://ethanheilman.github.com/flipIt/drawgame.html?flips=100:X,200:Y,300:Y,400:X,450:Y,650:Y,670:X,800:Y,900:X)

The format is, the turn at which the flip was made (out of 1000 turns) and the player (X or Y) made the move, each separated by a colon (100:X).
Each flip is seperated from the other flips by a comma. 
For example: Turn 100 X flips, Turn 200 X flips, Turn 233 Y Flips is written as 100:X,200:X,233Y.
These games can be saved to png files by right clicking and choosing 'Save Image As' (works only in firefox).
You can also embed games rendered in this fashion in webpages by adding the html code:

    <iframe 
    src="http://ethanheilman.github.com/flipIt/drawgame.html?flips=100:X,200:Y,300:Y,400:X,450:Y" 
    width="850" height="200" frameborder="0"></iframe>

Examples
--------

Working examples can be found in the examples directory. 
To see all three examples in action go to [http://ethanheilman.github.com/flipIt](http://ethanheilman.github.com/flipIt). To play against the computer will full rules click [here](http://ethanheilman.github.com/flipIt/playable_with_instructions.html).

### Computer vs Computer Game

A Computer vs computer game can be added to a webpage by either linked to an iframe like so

    <iframe src="http://ethanheilman.github.com/flipIt/computer.html" 
    width="850" height="200" frameborder="0"></iframe>

or by including the following javascript.

    <script type="text/javascript" 
    src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script type="text/javascript" 
    src="https://raw.github.com/EthanHeilman/flipIt/master/js/flipit.js"></script>
    <script type="text/javascript" 
    src="https://raw.github.com/EthanHeilman/flipIt/master/js/drawflipit.js"></script>

    <canvas id="gameBoard" width="800" height="150"></canvas>

    <script type="text/javascript">

        var numTicksShort = 1000;
        var msPerTickFast = 1;
        
        var config = new RenderSettings( $("#gameBoard") ); 
        config.numticks = numTicksShort;
        var gDraw = new FlipItRenderEngine( config );

        var game = new FlipItGame( gDraw, 
          Players["randomPlayer"], Players["periodicPlayer"] );
        
        game.newGame();
        game.start( msPerTickFast, numTicksShort );
    </script>

To see this example in action go to [http://ethanheilman.github.com/flipIt/computer.html](http://ethanheilman.github.com/flipIt/computer.html).


### Human vs Computer Game

To play against a computer go [here](http://ethanheilman.github.com/flipIt/playable_with_instructions.html).
A human vs computer game can be added to a webpage by either linking to an iframe like so

    <iframe src="http://ethanheilman.github.com/flipIt/playable.html" 
    width="850" height="250" frameborder="0"></iframe>

or by including the following javascript.

    <script type="text/javascript" 
    src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script type="text/javascript" 
    src="https://raw.github.com/EthanHeilman/flipIt/master/js/flipit.js"></script>
    <script type="text/javascript" 
    src="https://raw.github.com/EthanHeilman/flipIt/master/js/drawflipit.js"></script>

    <div id="scoreBoard"></div>
    <canvas id="gameBoard2" width="800" height="150"></canvas>
    <button id="startBtn">Start</button> to play as the blue player
    <button id="flipBtn">Flip</button> to flip.
    <script>
        var msPerTickSlow = 10;
                var numTicksLong = 2000;

        var g2conf = new RenderSettings( $("#gameBoard2") ); 

        g2conf.fogOfWar = true;
        g2conf.numTicks = numTicksLong;

        var g2Draw = new FlipItRenderEngine( g2conf );
        var sb = new ScoreBoard( $("#scoreBoard"), g2conf.xColor, g2conf.yColor );        
        var g2 = new FlipItGame( g2Draw, 
          Players["humanPlayer"], Players["randomPlayer"], sb.update );

        g2.newGame();
        sb.update(0, 0);
        
        //setup buttons
        $("#startBtn").click( function() {
          sb.update(0, 0);
          g2.start( msPerTickSlow, numTicksLong );
        });

        $("#flipBtn").click( function() {
          g2.defenderFlip();
          sb.update( g2.xScore, g2.yScore );
        });
    </script>

To see this example in action go to [http://ethanheilman.github.com/flipIt/playable.html](http://ethanheilman.github.com/flipIt/playable.html) or [http://ethanheilman.github.com/flipIt/playable_with_instructions.html](http://ethanheilman.github.com/flipIt/playable_with_instructions.html).

### Render Games

If you have a list of moves in a flipIt and we wish to render the state of the game include the following javascript in a webpage and then right click to import as a png.

    <script type="text/javascript" 
    src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script type="text/javascript" 
    src="https://raw.github.com/EthanHeilman/flipIt/master/js/flipit.js"></script>
    <script type="text/javascript" 
    src="https://raw.github.com/EthanHeilman/flipIt/master/js/drawflipit.js"></script>

    <canvas id="gameBoard3" width="800" height="150"></canvas>

    <script>
        var g3Conf = new RenderSettings( $("#gameBoard3") ); 
        var g3Draw = new FlipItRenderEngine( g3Conf );
        g3Draw.newBoard();
        g3Draw.drawBoard(1000, {300: "X", 500: "Y", 900: "X"});
    </script>

In the above example we render the game X flips on turn 300, Y flips on turn 500, X flips on turn 900, out of a total 1000 turns.

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
The score is given in the upper left hand corner.
