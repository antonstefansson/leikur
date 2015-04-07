window.Player = (function() {
	'use strict';

	var Controls = window.Controls;

	// All these constants are in em's, multiply by 10 pixels
	// for 1024x576px canvas.
	var SPEED = 30; // * 10 pixels per second
	var WIDTH = 5;
	var HEIGHT = 5;
	var gravity = 1.3;
	var rotate = 0;
	var velocity = 1;
	var INITIAL_POSITION_X;
	var INITIAL_POSITION_Y;
	var playing = false;

	var Player = function(el, game) {
		this.el = el;
		this.game = game;
		this.pos = { x: 0, y: 0 };

		INITIAL_POSITION_X = (this.game.WORLD_WIDTH - WIDTH / 2) / 2;
		INITIAL_POSITION_Y = (this.game.WORLD_HEIGHT - HEIGHT / 2) / 2;
	};

	/**
	 * Resets the state of the player for a new game.
	 */
	Player.prototype.reset = function() {
		this.pos.x = INITIAL_POSITION_X;
		this.pos.y = INITIAL_POSITION_Y;
		Controls._didJump = false;
	};

	Player.prototype.onFrame = function(delta) {
		if (Controls.keys.space || Controls.mouse.mouse1) {
			playing = true;
			rotate = 0;
			SPEED = 70;
			this.pos.y -= delta * SPEED;
			SPEED = 0;
			rotate -= 20;
			if(!this.game.mute){
				document.getElementById('flap').play();
			}
			this.el.css('transform','translate(' + this.pos.x + 'em, ' + this.pos.y + 'em) rotate('+ rotate + 'deg)');
			velocity = 0;
		}
		else if(Controls._onKeyDown && Controls._didJump) {
			SPEED += gravity;
			this.pos.y += delta * SPEED;
			velocity += 1;
			if(rotate < 90 && velocity > 10){
				rotate += 1 * 3;
			}
			this.el.css('transform','translate(' + this.pos.x + 'em, ' + this.pos.y + 'em) rotate(' + rotate +'deg)');
		}
		else
		{
			this.el.css('transform','translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
		}
		this.checkCollisionWithBounds();

		// Update UI
		//this.el.css('transform', 'translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
	};
	Player.prototype.checkCollisionWithBounds = function() {
		if (this.pos.x < 0 ||
			this.pos.x + WIDTH > this.game.WORLD_WIDTH ||
			this.pos.y < 0 ||
			this.pos.y + HEIGHT > this.game.WORLD_HEIGHT - 12.5) {
			return this.game.gameover();
		}
	};

	return Player;

})();
