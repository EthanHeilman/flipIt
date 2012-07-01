

function FlipItRenderEngine( board, numTicks, player, fogOfWar ){
  var circleSize = board.width()/200;
  
  var rightMargin = 8;

  this.xColor = "0066CC"; //blue
  this.yColor = "CC2200"; //red

  this.board = board;
  this.numTicks = numTicks;

  this.player = player;
  this.fogOfWar = fogOfWar;

  this.newBoard = function(){
    this.revealed = numTicks; //reveal all 
    if ( this.fogOfWar ) {
      this.revealed = 0;
    } 
  };

  this.drawBoard = function(ticks, flips){

    var context = this.board[0].getContext("2d");

    var h = this.board.height();
    var w = this.board.width();

    var numTicks = this.numTicks;
    // maps ticks in the game state to x-coordines on the board
    var mapX = function( tick ){
        return (tick/numTicks) * ( w - rightMargin );
    };

    context.clearRect( 0, 0, w, h );

    var control = "X";
    var lastFlip = 0;

    var xIntervals = [];
    var yIntervals = [];

    for ( var tick = 0; tick < ticks; tick++ ) {
      if ( tick in flips ) {
        var x = mapX(tick);

        // When "the player" makes a move reveal the board. This only applies when fog is on.
        if ( flips[tick] == this.player && this.revealed < tick ) {
          this.revealed = tick;
        }

        if ( tick <= this.revealed ) { //Don't draw circles if hidden by fog of war
          if ( flips[tick] == "Y" ) drawCircle( context, this.yColor, circleSize, x, h/4); 
          if ( flips[tick] == "X" ) drawCircle( context, this.xColor, circleSize,  x, 3*h/4); 
        } 

        if ( flips[tick] != control ) { //control has been changed.
          if ( flips[tick] == "Y" ) xIntervals.push( [lastFlip, tick-1] );
          if ( flips[tick] == "X" ) yIntervals.push( [lastFlip, tick-1] );
          lastFlip = tick;
          control = flips[tick];
        }
      }
    }

    //add final interval
    if( lastFlip < ticks ) {
      if ( control == "X" ) xIntervals.push( [lastFlip, ticks] );
      if ( control == "Y" ) yIntervals.push( [lastFlip, ticks] );
    }


    //draw the intervals (chunks of controlled contigious territory)
    for ( var i in xIntervals ) {
      var interval = xIntervals[i]; 
      drawRect( context, mapX(interval[0]), h - h/3, mapX(interval[1]-interval[0]), -h/6, this.xColor);
    }
    for ( var i in yIntervals ) {
      var interval = yIntervals[i];
      drawRect( context, mapX(interval[0]), h/3, mapX(interval[1]-interval[0]), h/6, this.yColor );
    }

    //draw the lines after each flip
    control = "X";
    for ( var tick in flips ) {
      if ( flips[tick] != control ){
        drawHLine( context, mapX(tick), h/3, h/3);
        control = flips[tick]; 
      }
    }

    //draw fog of war as long as the game is still running
    if ( this.fogOfWar && ( ticks != this.numTicks ) ) {
      var x = this.revealed;
      var l = ticks - this.revealed;
      drawRect( context, mapX(x), h - h/3, mapX(l), -h/6, "grey");
      drawRect( context, mapX(x), h/3, mapX(l), h/6, "grey" );
    }


    drawHLine( context, mapX(ticks), h/3, h/3);

    drawArrow( context, 0, h/2, w, h/2 );
    drawHLine( context, 3, h/3, h/3 )
  };
}

// Setup playable game
function ScoreBoard( scoreBoardElement, xColor, yColor ) {

  this.update = function(xScore, yScore) { 
    output = ""

    output += "<b><font color="+xColor+">Blue:</font></b> "+xScore;
    output += " ";
    output += "<b><font color="+yColor+">Red:</font></b> "+yScore;

    output += "</br>";

    scoreBoardElement.html(output);
  };
};


//canvas util functions
function drawArrow(context, x1, y1, x2, y2){

  context.fillStyle = "black";
  context.lineWidth=2;
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
    context.lineTo(x2-head_size, y2-head_size);
    context.lineTo(x2-head_size, y2+head_size);
    context.lineTo(x2, y2);
  context.closePath();
  context.fill();  
}

function drawCircle(context, color, size, x, y){
  context.fillStyle = color;
  context.lineWidth=2;
  context.beginPath();
    context.arc(x, y, size, 0, Math.PI*2, true); 
  context.closePath();
  context.fill();
  context.stroke();
}

function drawRect(context, x, y, w, h, color) {
  context.fillStyle = color;
  context.lineWidth=2;

  context.beginPath();
    context.rect( x, y, w, h );
  context.closePath();
  context.fill();
  context.stroke();
}

function drawHLine(context, x, y, l) {

  // firefox does not render lines with large widths correctly
  var line_fix = 0;
  var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  if ( is_firefox ){
    line_fix = 2;
  }

  context.lineWidth= 5;

  context.beginPath();
    context.moveTo(x, y + line_fix);
    context.lineTo(x, y + l - line_fix);
  context.closePath();
  context.stroke();
}