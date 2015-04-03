window.Pipe = (function() {
	'use strict';

	// All these constants are in em's, multiply by 10 pixels
	// for 1024x576px canvas.
	var SPEED = 18.5; // * 10 pixels per second
	var WIDTH = 7;
	var HEIGHT = 40;
	var INITIAL_POSITION_X = 110;
	var INITIAL_POSITION_Y = 20;

	var Pipe = function(el, game, player) {
		this.pipes = [el.find('#pipe1'),el.find('#pipe2'),el.find('#pipe3'),el.find('#pipe4'),el.find('#pipe5'),el.find('#pipe6')];
		this.game = game;
		this.player = player;
		this.poss = [{ x: 0, y: 0, done: false},{ x: 0, y: 0, done: false},{ x: 0, y: 0,done: false },{ x: 0, y: 0,done: false },{ x: 0, y: 0,done: false },{ x: 0, y: 0,done: false }];
	};

	/**
	 * Resets the state of the player for a new game.
	 */
	Pipe.prototype.reset = function() {

		for(var i = 0; i<6; i+=2){
			var rand = Math.floor( Math.random() * ( 1 + 15 - 0 ) ) + 0;
			this.poss[i].x = INITIAL_POSITION_X+i*20;
			this.poss[i].y = INITIAL_POSITION_Y+rand;
			this.poss[i+1].x = INITIAL_POSITION_X+i*20;
			this.poss[i+1].y = -30 + rand;
			this.poss[i].done = false;
			this.poss[i+1].done = false;
		}
	};

	Pipe.prototype.onFrame = function(delta) {

		for(var i = 0; i<6; i++){
			this.poss[i].x -= delta * SPEED;
		}

		this.checkCollisionWithBounds();

		for(var i = 0; i<6; i+=2){
			if(this.poss[i].x <= -WIDTH){
				var rand = Math.floor( Math.random() * ( 1 + 15 - 0 ) ) + 0;
				this.poss[i].x = INITIAL_POSITION_X;
				this.poss[i].y = INITIAL_POSITION_Y+rand;
				this.poss[i+1].x = INITIAL_POSITION_X;
				this.poss[i+1].y = -30 + rand;
				this.poss[i].done = false;
				this.poss[i+1].done = false;
			}
			this.pipes[i].css('transform', 'translate(' + this.poss[i].x + 'em, ' + this.poss[i].y + 'em)');
			this.pipes[i+1].css('transform', 'translate(' + this.poss[i+1].x + 'em, ' + this.poss[i+1].y + 'em)');
		}
	};

	Pipe.prototype.checkCollisionWithBounds = function() {
		for(var i = 0; i<6; i++){
			if((this.player.pos.x > this.poss[i].x && this.player.pos.x < (this.poss[i].x+WIDTH) &&
			 this.player.pos.y+5 > this.poss[i].y && this.player.pos.y+5 < this.poss[i].y+HEIGHT) ||
				((this.player.pos.x+5) > this.poss[i].x && this.player.pos.x < (this.poss[i].x+WIDTH) &&
				 this.player.pos.y+5 > this.poss[i].y && this.player.pos.y+5 < this.poss[i].y+HEIGHT)
				){
				return this.game.gameover();
			}

			if((this.player.pos.x > this.poss[i].x && this.player.pos.x < (this.poss[i].x+WIDTH) &&
			 this.player.pos.y > this.poss[i].y && this.player.pos.y < this.poss[i].y+HEIGHT) ||
				((this.player.pos.x+5) > this.poss[i].x && this.player.pos.x < (this.poss[i].x+WIDTH) &&
				 this.player.pos.y > this.poss[i].y && this.player.pos.y < this.poss[i].y+HEIGHT)
				){
				return this.game.gameover();
			}

			if(this.player.pos.x > this.poss[i].x && !this.poss[i].done){
				this.game.addToScore();
				this.poss[i].done = true;
				this.poss[i+1].done = true;
			}
		}
	};

	return Pipe;

})();