/**
 * @author Ethan Heilman
 * @author Ingo Schubert
 **/


/**
 * Holds all the settings for the FlitItRenderEngine.
 *
 *
 * @param board  the board element which we draw on.
 *
 */
function RenderSettings(board) {

    this.board = board;
    this.numTicks = 1000; // length of game in turns
    this.xColor = "#0066CC"; // blue
    this.yColor = "#CC2200"; // red
    this.player = "X";
    this.fogOfWar = false;
    this.rightMargin = 8;
}


/**
 * Responsible for drawing flip it games.
 *
 * new FlipItRenderEngine( new RenderSettings( $("board") ) ) 
 *
 * @param renderSettings  the settings for this object.
 *
 */
function FlipItRenderEngine(renderSettings) {

    // Setup the object.
    var board = renderSettings.board;
    var numTicks = renderSettings.numTicks;

    var xColor = renderSettings.xColor;
    var yColor = renderSettings.yColor;

    var player = renderSettings.player;
    var fogOfWar = renderSettings.fogOfWar;

    var circleSize = board.width() / 200;
    var rightMargin = renderSettings.rightMargin;


    /**
     * Sets up a new board. 
     **/
    this.newBoard = function () {
        this.revealed = numTicks; // reveal all 

        if (fogOfWar)
            this.revealed = 0; // hide all

    };

    /**
     * Given a list of the flips which have occured draws the state of the game.
     *
     * this.drawBoard( int, { int: string, int:string ...} )
     * 
     * ticks  current number of ticks/turns into the game (what turn is it).
     * flips  state of the game. { tick : ("X"|"Y") }
     **/
    this.drawBoard = function (ticks, flips) {

        var context = board[0].getContext("2d");

        var h = board.height();
        var w = board.width();

        // maps ticks in the game state to x-coordines on the board
        var mapX = function (tick) {
            return (tick / numTicks) * (w - rightMargin);
        };

        context.clearRect(0, 0, w, h);

        var control = "X";
        var lastFlip = 0;

        var xIntervals = [];
        var yIntervals = [];

        for (var tick = 0; tick < ticks; tick++) {
            if (tick in flips) {
                var x = mapX(tick);

                // When "the player" makes a move reveal the board. This only applies when fog is on.
                if (flips[tick] == player && this.revealed < tick) {
                    this.revealed = tick;
                }

                if (tick <= this.revealed) { // Don't draw circles if hidden by fog of war.
                    if (flips[tick] == "Y")
                        drawCircle(context, yColor, circleSize, x, h / 4);
                    if (flips[tick] == "X")
                        drawCircle(context, xColor, circleSize, x, 3 * h / 4);
                }

                if (flips[tick] != control) { // Control has been changed.
                    if (flips[tick] == "Y")
                        xIntervals.push([lastFlip, tick - 1]);
                    if (flips[tick] == "X")
                        yIntervals.push([lastFlip, tick - 1]);
                    lastFlip = tick;
                    control = flips[tick];
                }
            }
        }

        // Add final interval
        if (lastFlip < ticks) {
            if (control == "X")
                xIntervals.push([lastFlip, ticks]);
            if (control == "Y")
                yIntervals.push([lastFlip, ticks]);
        }


        // Draw the intervals (chunks of controlled contigious territory)
        for (var i in xIntervals) {
            var interval = xIntervals[i];
            drawRect(context, mapX(interval[0]), h - h / 3, mapX(interval[1] - interval[0]), -h / 6, xColor);
        }
        for (var i in yIntervals) {
            var interval = yIntervals[i];
            drawRect(context, mapX(interval[0]), h / 3, mapX(interval[1] - interval[0]), h / 6, yColor);
        }

        // Draw the lines after each flip
        control = "X";
        for (var tick in flips) {
            if (flips[tick] != control) {
                drawHLine(context, mapX(tick), h / 3, h / 3);
                control = flips[tick];
            }
        }

        // Draw fog of war as long as the game is still running
        if (fogOfWar && (ticks != numTicks)) {
            var x = this.revealed;
            var l = ticks - this.revealed;
            drawRect(context, mapX(x), h - h / 3, mapX(l), -h / 6, "grey");
            drawRect(context, mapX(x), h / 3, mapX(l), h / 6, "grey");
        }


        //Draw coordinate system
        
        context.strokeStyle="silver";
        drawHLine(context, mapX(ticks), h / 3, h / 3);

        drawArrow(context, 0, h / 2, w, h / 2);
        drawHLine(context, 3, h / 3, h / 3)
    };
}

/**
 * Displays the current score.
 *
 * new ScoreBoard(  )
 *
 *
 */
function ScoreBoard( ) {

    this.update = function (xScore, xCost, yScore, yCost) {


        $("#blueControl").html(xScore + xCost);
        $("#blueScore").html("" + xScore);
        $("#blueCost").html("" + xCost);
        $("#redControl").html(yScore + yCost);
        $("#redScore").html("" + yScore);
        $("#redCost").html("" + yCost);

    };
}
;


/**
 * Canvas util functions
 *
 *
 */
function drawArrow(context, x1, y1, x2, y2) {

    context.fillStyle = "silver";
    context.lineWidth = 2;
    //draw a line
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.stroke();

    //draw the head
    var head_size = 7;
    context.moveTo(x2, y2);
    context.beginPath();
    context.lineTo(x2 - head_size, y2 - head_size);
    context.lineTo(x2 - head_size, y2 + head_size);
    context.lineTo(x2, y2);
    context.closePath();
    context.fill();
}

function drawCircle(context, color, size, x, y) {
    context.fillStyle = color;
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.beginPath();
    context.arc(x, y, size, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
    context.stroke();
    context.strokeStyle = "silver";
}

function drawRect(context, x, y, w, h, color) {
    context.fillStyle = color;
    context.lineWidth = 2;

    context.beginPath();
    context.rect(x, y, w, h);
    context.closePath();
    context.fill();
    context.stroke();
}

// Draws a horizontal line starting a the point (x, y) of length l
function drawHLine(context, x, y, l) {

    // firefox does not render lines with large widths correctly
    var line_fix = 0;
    var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (is_firefox) {
        line_fix = 2;
    }

    context.lineWidth = 5;

    context.beginPath();
    context.moveTo(x, y + line_fix);
    context.lineTo(x, y + l - line_fix);
    context.closePath();
    context.stroke();
}
