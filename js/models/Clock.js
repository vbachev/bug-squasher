define([ 'models/Topic', 'models/Tools' ], function ( Topic, Tools )
{
  // Clock singleton class
  // ======================================================================
  // Used to synchronize the whole system. Implement the browser's
  // requestAnimationFrame to set its tick period (around 60fps)
  //
  function Clock ()
  {
    // ====================================================================
    // Initialization

    // singleton implementation
    if ( arguments.callee._singletonInstance )
      return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;

    // requestAnimationFrame polyfill by Erik Möller
    // fixes from Paul Irish and Tino Zijdel
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    (function() {
      var lastTime = 0;
      var vendors = ['ms', 'moz', 'webkit', 'o'];
      for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
          window[vendors[x]+'CancelRequestAnimationFrame'];
      }
      if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
          lastTime = currTime + timeToCall;
          return id;
        };
      if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
          clearTimeout(id);
        };
    }());

    // ====================================================================
    // Public members

    this.id = _.uniqueId();

    // used to switch the clock on or off
    this.toggle = function toggle ( a_state )
    {
      if( a_state === undefined ){
        a_state = _handbrake;
      }

      if( a_state ){
        _start();
      } else {
        _stop();
      }
    };

    // ====================================================================
    // Private members

    var _handbrake = true,
        _tickId;

    function _tick ()
    {
      // if _handbrake is on - cancel this and any scheduled tick cycles
      if( _handbrake ){
        cancelAnimationFrame( _tickId );
        return;
      }

      Topic.publish( 'clock' );
      
      // schedule next tick cycle
      _tickId = requestAnimationFrame( _tick );
    }

    function _start ()
    {
      Tools.log('Clock started');
      _handbrake = false;
      _tick();
    }

    function _stop ()
    {
      Tools.log('Clock stopped');
      _handbrake = true;
    }

    return this;
  }

  // will always return a singleton
  return new Clock();

});