window.Player = (function() {
	'use strict';

	var Controls = window.Controls;

	// All these constants are in em's, multiply by 10 pixels
	// for 1024x576px canvas.
	var SPEED = 30; // * 10 pixels per second
	var WIDTH = 5;
	var HEIGHT = 5;
	var gravity = 0.5;
	var velocity = 0;
	var rotation = 0;
	var INITIAL_POSITION_X;
	var INITIAL_POSITION_Y;
	var frame = 0;
	var animation = [0,1,2,1];
	var gameStarted = false;

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
		if (Controls.keys.space) {
			SPEED = 50;
			this.pos.y -= delta * SPEED;
			gameStarted = true;
			SPEED = 20;
		}
		if(Controls._onKeyDown && Controls._didJump){
			SPEED += gravity;
			this.pos.y += delta * SPEED;
		}
		this.checkCollisionWithBounds();

		// Update UI
		this.el.css('transform', 'translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
	};

	Player.prototype.checkCollisionWithBounds = function() {
		if (this.pos.x < 0 ||
			this.pos.x + WIDTH > this.game.WORLD_WIDTH ||
			this.pos.y < 0 ||
			this.pos.y + HEIGHT > this.game.WORLD_HEIGHT) {
			return this.game.gameover();
		}
	};

	return Player;

})();
