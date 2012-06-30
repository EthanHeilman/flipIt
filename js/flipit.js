function FlipItGame( renderer, playerX, playerY, scoreBoardFunct){
  var xControlBenefit = 1;
  var yControlBenefit = 1;

  var xFlipCost = 100;
  var yFlipCost = 100;
  
  this.newGame = function(){
    clearInterval( this.clock );

    this.running = false;
    
    this.ticks = 0;
    this.control = "X";
    this.flips = [];

    this.xScore = 0;
    this.yScore = 0;


    renderer.drawBoard( 0, [] );
  }

  this.start = function( msPerTick, numTicks ) {
    this.newGame();

    if (this.running == false ){
      this.running = true;

      renderer.newBoard();

      var self = this; //Save the current context
      this.clock = setInterval( function(){ self.tick( numTicks ); }, msPerTick);
    }
  };

  this.endGame = function() {
    clearInterval( this.clock );
    this.running = false;

    if ( scoreBoardFunct != null ) scoreBoardFunct( this.xScore, this.yScore );
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
    
    //only draw every fifth frame
    if ( this.ticks % 5 == 0 ) renderer.drawBoard( this.ticks, this.flips );
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




