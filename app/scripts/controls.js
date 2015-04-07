
window.Controls = (function() {
    'use strict';

    /**
     * Key codes we're interested in.
     */
    var KEYS = {
        32: 'space'
    };
    var MOUSE = {
        0: 'mouse1'
    }
    /**
     * A singleton class which abstracts all player input,
     * should hide complexity of dealing with keyboard, mouse
     * and touch devices.
     * @constructor
     */
    var Controls = function() {
        this._didJump = false;
        this.keys = {};
        this.mouse = {};
        $(window)
            .on('keydown', this._onKeyDown.bind(this))
            .on('keyup', this._onKeyUp.bind(this))
            .on('mousedown', this._onKeyDown.bind(this))
            .on('mouseup', this._onKeyUp.bind(this));
    };
    Controls.prototype._onKeyDown = function(e) {
        // Only jump if space wasn't pressed.
        if (e.keyCode === 32 && !this.keys.space) {
            this._didJump = true;
        }
        if(e.button === 0 && !this.mouse.mouse1) {
            this._didJump =true;
        }

        // Remember that this button is down.
        if (e.keyCode in KEYS) {
            var keyName = KEYS[e.keyCode];
            this.keys[keyName] = true;
            return false;
        }
        if(e.button in MOUSE) {
            var mouseName = MOUSE[e.button];
            this.mouse[mouseName] = true;
            return false
        }
    };
    Controls.prototype._onKeyUp = function(e) {
        if (e.keyCode in KEYS) {
            var keyName = KEYS[e.keyCode];
            this.keys[keyName] = false;
            return false;
        }
        if(e.button in MOUSE) {
            var mouseName = MOUSE[e.button];
            this.mouse[mouseName] = false;
            return false;
        }
    };
    /**
     * Only answers true once until a key is pressed again.
     */
    Controls.prototype.didJump = function() {
        var answer = this._didJump;
        this._didJump = false;
        return answer;
    };
    
    // Export singleton.
    return new Controls();
})();
