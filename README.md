flipIt - The Game of Stealthy Takeover
======

A javascript implementation of flipIt the game of stealthy takeover. 
The game was invented by Marten van Dijk, Ari Juels, Alina Oprea, and Ronald L. Rivest in the paper [FLIPIT: The Game of “Stealthy Takeover”](http://www.rsa.com/rsalabs/presentations/Flipit.pdf). 
This is the only known computer implementation of the game that I know of.

About the Game
----------------

Flip it is played by two players, X and Y. 
The object of the game is to score as many points as possible.
Players score points for every second they control the board.
The only action that either player can perform is to 'flip'.
Each flip action costs the flipping player points. 
If a player chooses to flip and they are in control of the board then they stay in control of the board.
Player x always starts the game in control of the board.
If on the other hand a player is not in control of the board then when they flip they will gain control of the board.
Players only learn the state of the board when they flip.

Playing the Game
-----------------

Click [here](http://ethanheilman.github.com/flipIt/playable_with_instructions.html) to play flipIt against the computer.


Flip It Notation Rendering
----------------

To generate a flip game from a list of past moves call the following url appending the moves to the end of the url.

[http://ethanheilman.github.com/flipIt/drawgame.html?flips=100:X,200:Y,300:Y,400:X,450:Y,650:Y,670:X,800:Y,900:X](http://ethanheilman.github.com/flipIt/drawgame.html?flips=100:X,200:Y,300:Y,400:X,450:Y,650:Y,670:X,800:Y,900:X)

The format is the turn at which the flip was made (out of 1000 turns) and which player (X or Y) made the move seperated by a colon (100:X).
Each flip is seperated from the other flips by a comma. 
Turn 100 X flips, Turn 200 X flips, Turn 233 Y Flips becomes 100:X,200:X,233Y.
These games can be saved to png files by right clicking and choosing 'Save Image As' (works only in firefox).
You can embed games rendered in this fashion add the html code:
    <iframe 
    src="http://ethanheilman.github.com/flipIt/drawgame.html?flips=100:X,200:Y,300:Y,400:X,450:Y" 
    width="850" height="200" frameborder="0"></iframe>

Examples
--------

Working examples can be found in the examples directory. 
To see all three examples in action go to [http://ethanheilman.github.com/flipIt](http://ethanheilman.github.com/flipIt).

## Computer vs computer game:

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


## Human vs computer game:

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

To see this example in action go to [http://ethanheilman.github.com/flipIt/playable.html](http://ethanheilman.github.com/flipIt/playable.html).

## Draw games based on recorded moves.

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