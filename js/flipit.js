function FlipItGame( render, numRounds, msPerTick, playerX, playerY ){
  
  this.newGame = function(){
    this.running = false;
    clearInterval( this.clock );
    this.ticks = 0;
    this.control = "X";
    this.flips = [];

    this.render.drawBoard( 0, this.numRounds, this.flips );
  }

  this.numRounds = numRounds;
  this.msPerTick = msPerTick;
  this.render = render;

  //this is the main game loop
  this.tick = function() {
    if( this.ticks >= this.numRounds ) {
      this.endGame();
      return;
    } 
    
    this.ticks += 1;

    //if a human is planning then their player function is set to neverMove()
    if( playerX( this.ticks ) ){ this.defenderFlip() }; //player x makes their move
    if( playerY( this.ticks ) ){ this.attackerFlip() }; //player y makes their move

    this.render.drawBoard( this.ticks, this.numRounds, this.flips );
  }



  this.start = function() {
    this.newGame();

    if (this.running == false ){
      this.running = true;

      var self = this; //Save the current context
      this.clock = setInterval( function(){ self.tick(); }, this.msPerTick);
    }
  };

  this.endGame = function() {
    clearInterval( this.clock );
    this.running = false;
    console.log( "done." );
  };

  this.defenderFlip = function() {
    if (this.running == true) {
      this.flips[this.ticks] = "X";
    }
  };

  this.attackerFlip = function(){
    if (this.running == true) {
      this.flips[this.ticks] = "Y";
    }
  }

};


//Computer players
function neverMove( ticks ){};
function randomMove( ticks ){ return Math.random(ticks) < 0.003; };
function periodicMove( ticks ){ return ticks % 300 == 0; };


function Render( board ){
  this.board = board;
  this.circle_size = this.board.width()/200;


  this.drawBoard = function(ticks, rounds, flips){
    var context = this.board[0].getContext("2d");

    var w = this.board.width();
    var h = this.board.height();

    // maps ticks in the game state to x-coordines on the board
    mapX = function( tick ){
      return (tick/rounds) * w;
    };

    context.clearRect ( 0, 0, w, h );

    var control = "X";
    var lastFlip = 0;

    var xIntervals = [];
    var yIntervals = [];

    for ( var tick = 0; tick < ticks; tick++ ) {
      if ( tick in flips ) {
        var x = mapX(tick);

        if ( flips[tick] == "X" ) drawCircle( context, "blue", this.circle_size, x, h/4); 
        if ( flips[tick] == "Y" ) drawCircle( context, "red", this.circle_size,  x, 3*h/4); 
        
        if ( flips[tick] != control ) { //control has been changed
          if ( flips[tick] == "X" ) yIntervals.push( [lastFlip, tick-1] );
          if ( flips[tick] == "Y" ) xIntervals.push( [lastFlip, tick-1] );
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
      context.fillStyle = "blue";
      context.fillRect( mapX(interval[0]), h/3, mapX(interval[1]-interval[0]), h/8 );
    }
    for ( var i in yIntervals ) {
      var interval = yIntervals[i];
      context.fillStyle = "red";
      context.fillRect( mapX(interval[0]), h - h/3, mapX(interval[1]-interval[0]), -h/8 );
    }

    drawArrow( context, 0, h/2, w, h/2 );
  };
}



//canvas util functions
function drawArrow(context, x1, y1, x2, y2){
  context.fillStyle = "black";

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

};

function drawCircle(context, color, size, x, y){
  context.fillStyle = color;
  context.beginPath();
    context.arc(x, y, size, 0, Math.PI*2, true); 
  context.closePath();
  context.fill();
};
