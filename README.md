flipIt- The Game of Stealthy Takeover
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


Examples
--------

Working examples can be found in the examples directory. 

## Computer vs computer game:

    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script type="text/javascript" src="https://raw.github.com/EthanHeilman/flipIt/master/js/flipit.js"></script>
    <script type="text/javascript" src="https://raw.github.com/EthanHeilman/flipIt/master/js/drawflipit.js"></script>

    <canvas id="gameBoard1" width="800" height="150"></canvas>

    <script>
        var numTicksShort = 1000;
        var msPerTickFast = 1;
              
        var gConf = new RenderSettings( $("#gameBoard") ); 
        gConf.numticks = numTicksShort;
        var gDraw = new FlipItRenderEngine( gConf );

        var g = new FlipItGame( gDraw, 
          Players["randomPlayer"], Players["periodicPlayer"] );
              
        g.newGame();
        g.start( msPerTickFast, numTicksShort );
      </script>

## Human vs computer game:
Click start to start the game. Note that since you are playing the blue player (player X), the board will appear grey until you flip to learn the state of the board.

    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script type="text/javascript" src="https://raw.github.com/EthanHeilman/flipIt/master/js/flipit.js"></script>
    <script type="text/javascript" src="https://raw.github.com/EthanHeilman/flipIt/master/js/drawflipit.js"></script>

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

## Draw games based on recorded moves.
Specify a set of moves to render that game, right click to import as a png.
In the below example we render the game X flips on turn 300, Y flips on turn 500, X flips on turn 900, out of a total 1000 turns.

    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script type="text/javascript" src="https://raw.github.com/EthanHeilman/flipIt/master/js/flipit.js"></script>
    <script type="text/javascript" src="https://raw.github.com/EthanHeilman/flipIt/master/js/drawflipit.js"></script>

    <canvas id="gameBoard3" width="800" height="150"></canvas>

    <script>
        var g3Conf = new RenderSettings( $("#gameBoard3") ); 
        var g3Draw = new FlipItRenderEngine( g3Conf );
        g3Draw.newBoard();
        g3Draw.drawBoard(1000, {300: "X", 500: "Y", 900: "X"});
    </script>
