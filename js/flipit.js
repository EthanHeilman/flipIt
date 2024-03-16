/**
 * @author Ethan Heilman 
 * @author Ingo Schubert
 **/


/**
 * Creates a new FlipItGame Object for playing 'flip it'.
 *
 * new FlipItGame( new FlipItRenderEngine, funct, funct, funct(num x, num y) )
 *
 * @param renderer  an object which draws the game.
 * @param playerX   a player function which decides when player X is to flip.
 * @param playerY   a player function which decides when player Y is to flip.
 * @param scoreBoardFunct function to draw scores, blank if no score board.
 * @param gameSettings the settings for this game (the costs and benefits)
 *
 **/
function FlipItGame(renderer, playerX, playerY, scoreBoardFunct, gameSettings) {
    var xControlBenefit = gameSettings.xControlBenefit;
    var yControlBenefit = gameSettings.yControlBenefit;

    var xFlipCost = gameSettings.xFlipCost;
    var yFlipCost = gameSettings.yFlipCost;

    var xRevealCost = gameSettings.xRevealCost;
    var yRevealCost = gameSettings.yRevealCost;

    var xCost = 0;
    var yCost = 0;
    var xScore = 0;
    var yScore = 0;

    /**
     * Clears and refreshes all the varables to start a new game.
     **/
    this.newGame = function () {
        clearInterval(this.clock);

        this.running = false;

        this.ticks = 0;
        this.control = "X";
        this.flips = [];

        this.xScore = 0;
        this.yScore = 0;

        this.xCost = 0;
        this.yCost = 0;


        renderer.drawBoard(0, []);
    }


    /** 
     * Start a game.
     *
     * this.start( int, int )
     *
     * @param msPerTick number of milliseconds per tick or turn of the game.
     * @param numTicks  length of game in ticks/turns.
     *
     **/
    this.start = function (msPerTick, numTicks) {
        this.newGame();

        if (this.running == false) {
            this.running = true;

            renderer.newBoard();

            var self = this; //Save the current context
            this.clock = setInterval(function () {
                self.tick(numTicks);
            }, msPerTick);
        }
    };

    /**
     * Ends the current game.
     **/
    this.endGame = function () {
        clearInterval(this.clock);
        this.running = false;

    };

    /**
     * The main game loop. End turn/tick this runs.
     *
     * this.tick( int )
     *
     * @param numTicks  length of game in ticks/turns.
     *
     **/
    this.tick = function (numTicks) {
        if (this.ticks >= numTicks) {
            this.endGame();
            return;
        }

        this.ticks += 1;

        if (this.control == "X")
            this.xScore += xControlBenefit;
        if (this.control == "Y")
            this.yScore += yControlBenefit;

        //if a human is playing a player function is set to neverMove()
        if (playerX(this.ticks)) {
            this.defenderFlip()
        }
        ; //player x makes their move
        if (playerY(this.ticks)) {
            this.attackerFlip()
        }
        ; //player y makes their move

        //only draw every fifth frame
        if (this.ticks % 5 == 0)
            renderer.drawBoard(this.ticks, this.flips);
    };

    /**
     * When the defender, player x, flips call this function. 
     **/
    this.defenderFlip = function () {
        if (this.running == true) {
            //default costs are the flip costs (looking if the resource belongs to player)
            let moveCost = xFlipCost;

            //check if reveal costs are defined (>0)
            if (xRevealCost > 0) {
                moveCost = xRevealCost;

                if (this.control == "Y") {
                    //If this move takes over, add flip costs
                    //Otherwise the cost is only the reveal cost
                    moveCost += xFlipCost;
                }
            }
            this.flips[this.ticks] = "X";
            this.control = "X";

            this.xScore -= moveCost;
            this.xCost += moveCost;

            if (playerX != Players["humanPlayer"]) {
                scoreBoardFunct(this.xScore, this.xCost, this.yScore, this.yCost);
            }


        }
    };

    /**
     * When the attacker, player y, flips call this function. 
     **/
    this.attackerFlip = function () {

        if (this.running == true) {
            //default costs are the flip costs (looking if the resource belongs to player)
            let moveCost = yFlipCost;

            //check if reveal costs are defined (>0)
            if (yRevealCost > 0) {
                moveCost = yRevealCost;

                if (this.control == "X") {
                    //If this move takes over, add flip costs
                    //Otherwise the cost is only the reveal cost
                    moveCost += yFlipCost;
                }
            }
            this.flips[this.ticks] = "Y";
            this.control = "Y";

            this.yScore -= moveCost;
            this.yCost += moveCost;

            if (playerX != Players["humanPlayer"]) {
                scoreBoardFunct(this.xScore, this.xCost, this.yScore, this.yCost);
            }
        }
    }
}
;


// Computer players
// Ingo: added periodicPlayerDelay which draws just a tiny bit after periodicPlayer
// this is to show that periodic play can be easily beaten.
var nextMoveTick=0;
var Players = {
    "humanPlayer": function (ticks) {
        return false
    },
    "randomPlayer": function (ticks) {
        if (ticks % 79 == 0)
            return Math.random(ticks) < 0.3;
    },
    "periodicPlayer": function (ticks) {
        return ticks % 200 == 0;
    },
    "periodicPlayerDelay": function (ticks) {
        return (ticks - 30) % 200 == 0;
    },
    "randomPlayerFast": function (ticks) {
        return Math.random(ticks) < 0.009;
    },
    "randomPlayerMinMoves": function (ticks) {
        const variance = Math.floor(Math.random() * 200);
        
        if (nextMoveTick==0){
            //calculating the first move
            nextMoveTick=100+variance;
        }
        
        if (ticks>nextMoveTick){
            //we reached the previously calculated next move.
            //calculate the next
            nextMoveTick+=100+variance;
            return true;
        }
        return false;
    }
    
};


/**
 * Holds all the settings for the FlitIt Game itself.
 *
 * e.g. benefits, costs
 *  
 *
 */
function GameSettings() {

    this.xControlBenefit = 1;
    this.yControlBenefit = 1;

    this.xFlipCost = 100;
    this.yFlipCost = 100;

    this.xRevealCost = 0;
    this.yRevealCost = 0;

}

