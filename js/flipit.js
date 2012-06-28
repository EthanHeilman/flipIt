function FlipItGame( board, numRounds, msPerTick, playerX, playerY ){

  this.numRounds = numRounds;
  this.msPerTick = msPerTick;
  this.flips = [];

  this.running = false;

  this.boardx = 0; 
  this.boardy = 0; 
  this.boardw = 700; 
  this.boardh = 200; 

  //setup board
  this.context = board[0].getContext("2d");
  
  drawBoard( this.context, this.boardx, this.boardy, this.boardw, this.boardh, 0, this.numRounds, this.flips );

  this.tick = function() {
    
    if( this.ticks >= this.numRounds ) {

      this.stop();

    } else {
    
      this.ticks += 1;

      drawBoard( this.context, this.boardx, this.boardy, this.boardw, this.boardh, this.ticks, this.numRounds, this.flips );
      
      //if a human is planning then their player function is set to neverMove()
      if( playerX( this.ticks ) ){ this.defenderFlip() }; //player x makes their move
      if( playerY( this.ticks ) ){ this.attackerFlip() }; //player y makes their move


    }

    //console.log( this.gameState );
  }

  this.start = function() {
    if (this.running == false ){
      this.running = true;

      //setup new game
      this.ticks = 0;
      this.control = "X";
      this.flips = [];

      drawBoard( this.context, this.boardx, this.boardy, this.boardw, this.boardh, 0, this.numRounds, this.flips );

      var self = this; //Save the current context
      this.clock = setInterval( function(){ self.tick(); }, this.msPerTick);
    }
  };

  this.stop = function() {
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


function drawBoard(context, x, y, w, h, ticks, rounds, flips){
  context.clearRect ( x, y, w, h );

  drawArrow( context, x, h/2, w, h/2 );

  var size = w/200; 

  var control = "X";
  var lastFlip = 0;

  var xIntervals = [];
  var yIntervals = [];

  for ( var tick = 0; tick < ticks; tick++ ){
    if ( tick in flips ){

      if ( flips[tick] == "X" ) {
        var x = ( tick/rounds ) * w;
        var y =  h/4;
        drawCircle( context, "blue", size, x, y); 
      }

      if ( flips[tick] == "Y" ) {
        var x = ( tick/rounds ) * w;
        var y =  3*h/4;
        drawCircle( context, "red", size, x, y); 
      }

      if ( flips[tick] != control ) { //control has been changed
        if ( flips[tick] == "X" ) yIntervals.push( [lastFlip, tick-1] );
        if ( flips[tick] == "Y" ) xIntervals.push( [lastFlip, tick-1] );
        lastFlip = tick;
        control = flips[tick];
      }
    }
  }

  for ( var i in xIntervals ) {
    var interval = xIntervals[i];

    context.fillStyle = "blue";
    context.fillRect( (interval[0]/rounds) * w, h/3, (interval[1]/rounds) * w - ( interval[0]/rounds ) * w, h/8 );
  }

  for ( var i in yIntervals ) {
    var interval = yIntervals[i];

    context.fillStyle = "red";
    context.fillRect( (interval[0]/rounds) * w, h - h/3, (interval[1]/rounds) * w - (interval[0]/rounds ) * w, -h/8 );
  }

  if( lastFlip < ticks ) {
    if ( control == "X" ) {
      context.fillStyle = "blue";
      context.fillRect( (lastFlip/rounds) * w, h/3, (ticks/rounds) * w - ( lastFlip/rounds ) * w, h/8 );
    } else if ( control == "Y" ) {
      context.fillStyle = "red";
      context.fillRect( (lastFlip/rounds) * w, h - h/3, (ticks/rounds) * w - (lastFlip/rounds ) * w, -h/8 );
    }
  }

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
