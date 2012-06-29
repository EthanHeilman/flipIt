function FlipItGame( renderer, playerX, playerY, finalScoresFunct){
  var xControlBenefit = 1;
  var yControlBenefit = 1;

  var xFlipCost = 100;
  var yFlipCost = 100;
  
  this.newGame = function(){
    this.running = false;
    clearInterval( this.clock );
    this.ticks = 0;
    this.control = "X";
    this.flips = [];

    this.xScore = 0;
    this.yScore = 0;

    renderer.drawBoard( 0, this.flips );
  }

  this.start = function( msPerTick, numTicks ) {
    this.newGame();

    if (this.running == false ){
      this.running = true;

      var self = this; //Save the current context
      this.clock = setInterval( function(){ self.tick( numTicks ); }, msPerTick);
    }
  };

  this.endGame = function() {
    clearInterval( this.clock );
    this.running = false;

    if ( finalScoresFunct != null ) {
      finalScoresFunct( this.xScore, this.yScore );
    }
    console.log( "done." );
  };


  //this is the main game loop
  this.tick = function( numTicks ) {
    if( this.ticks >= numTicks ) {
      this.endGame();
      return;
    } 
    
    this.ticks += 1;

    if ( this.control == "X" ) this.xScore += xControlBenefit;
    if ( this.control == "Y" ) this.yScore += yControlBenefit;

    //if a human is playing a player function is set to neverMove()
    if( playerX( this.ticks ) ){ this.defenderFlip() }; //player x makes their move
    if( playerY( this.ticks ) ){ this.attackerFlip() }; //player y makes their move
    
    renderer.drawBoard( this.ticks, this.flips );
  };

  this.defenderFlip = function() {
    if (this.running == true) {
      this.flips[this.ticks] = "X";
      this.control = "X";

      this.xScore -= xFlipCost;
    }
  };

  this.attackerFlip = function(){
    if (this.running == true) {
      this.flips[this.ticks] = "Y";
      this.control = "Y";

      this.yScore -= yFlipCost;
    }
  }
};


//Computer players
var Players = { 
  "humanPlayer":function( ticks ){ return false }, 
  "randomPlayer":function( ticks ){ if(ticks % 79 == 0) return Math.random(ticks) < 0.3; },
  "periodicPlayer":function( ticks ){ return ticks % 200 == 0; }
  };





function RenderEngine( board, numRounds, playerXColor, playerYColor ){
  var circle_size = board.width()/200;
  
  var rightMargin = 8;
  var rectHeight = 20;

  this.board = board;

  this.drawBoard = function(ticks, flips){

    //only draw every fifth frame
    if (ticks % 5 != 0 ) return;

    var context = this.board[0].getContext("2d");

    var h = this.board.height();
    var w = this.board.width();

    // maps ticks in the game state to x-coordines on the board
    var mapX = function( tick ){
        return (tick/numRounds) * ( w - rightMargin );
    };

    context.clearRect( 0, 0, w, h );

    var control = "X";
    var lastFlip = 0;

    var xIntervals = [];
    var yIntervals = [];

    for ( var tick = 0; tick < ticks; tick++ ) {
      if ( tick in flips ) {
        var x = mapX(tick);

        if ( flips[tick] == "Y" ) drawCircle( context, playerYColor, circle_size, x, h/4); 
        if ( flips[tick] == "X" ) drawCircle( context, playerXColor, circle_size,  x, 3*h/4); 
        
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
      drawRect( context, mapX(interval[0]), h - h/3, mapX(interval[1]-interval[0]), -h/6, playerXColor);
    }
    for ( var i in yIntervals ) {
      var interval = yIntervals[i];
      drawRect( context, mapX(interval[0]), h/3, mapX(interval[1]-interval[0]), h/6, playerYColor );
    }

    //draw the lines after each flip
    control = "X";
    for ( var tick in flips ) {
      if ( flips[tick] != control ){
        drawHLine( context, mapX(tick), h/3, h/3);
        control = flips[tick]; 
      }
    }

    drawHLine( context, mapX(ticks), h/3, h/3);

    drawArrow( context, 0, h/2, w, h/2 );
    drawHLine( context, 3, h/3, h/3 )
  };
}



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
