
window.Game = (function() {
	'use strict';

	/**
	 * Main game class.
	 * @param {Element} el jQuery element containing the game.
	 * @constructor
	 */

	var score = 0;
	var topScore = 0;
	var mute = false;

	var Game = function(el) {
		this.el = el;
		this.player = new window.Player(this.el.find('.Player'), this);
		this.pipe = new window.Pipe(this.el.find('.Pipes'), this, this.player);
		this.isPlaying = false;

		// Cache a bound onFrame since we need it each frame.
		this.onFrame = this.onFrame.bind(this);
	};

	/**
	 * Runs every frame. Calculates a delta and allows each game
	 * entity to update itself.
	 */
	Game.prototype.onFrame = function() {
		// Check if the game loop should stop.
		if (!this.isPlaying) {
			return;
		}

		// Calculate how long since last frame in seconds.
		var now = +new Date() / 1000,
				delta = now - this.lastFrame;
		this.lastFrame = now;

		// Update game entities.
		this.player.onFrame(delta);
		this.pipe.onFrame(delta);

		// Request next frame.
		window.requestAnimationFrame(this.onFrame);
	};

	/**
	 * Starts a new game.
	 */
	Game.prototype.start = function() {
		this.reset();
		this.el.find('.GameGround').addClass('Move');
		// Restart the onFrame loop
		this.lastFrame = +new Date() / 1000;
		window.requestAnimationFrame(this.onFrame);
		this.isPlaying = true;
	};

	/**
	 * Resets the state of the game so a new game can be started.
	 */
	Game.prototype.reset = function() {
		this.player.reset();
		this.pipe.reset();
		if(!mute){
			document.getElementById('Music').load();
		}
		score = 0;
		$( '.Score' ).text( ''+ score );
	};

	/**
	 * Signals that the game is over.
	 */
	Game.prototype.gameover = function() {
		this.isPlaying = false;
		if(!mute){
			document.getElementById('Die').play();
			document.getElementById('Music').pause();
		}
		// Should be refactored into a Scoreboard class.
		var that = this;
		var scoreboardEl = this.el.find('.Scoreboard');
		this.el.find('.GameGround').removeClass('Move');
	
		if(score > topScore){
			topScore = score;
		}
		$( '.Cur' ).text( ''+ score );
		$( '.Top' ).text( ''+ topScore );
		$( '.Score' ).text('');

		scoreboardEl
			.addClass('is-visible')
			.find('.Scoreboard-restart')
				.one('click', function() {
					scoreboardEl.removeClass('is-visible');
					that.start();
				});
	};

	Game.prototype.addToScore = function(){
		score++;
		$( '.Score' ).text( ''+ score );
		if(!mute){
			document.getElementById('Point').play();
		}
	};

	$( '.Mute' ).click(function() {
		if(mute){
			document.getElementById('Music').play();
			$('.Mute').attr('src','styles/Images/muteoff.png');
		}
		else{
			document.getElementById('Music').pause();
			$('.Mute').attr('src','styles/Images/muteon.png');
		}
		mute = !mute;
	});

	/**
	 * Some shared constants.
	 */
	Game.prototype.WORLD_WIDTH = 102.4;
	Game.prototype.WORLD_HEIGHT = 57.6;

	return Game;
})();


