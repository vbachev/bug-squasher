// object to host dependecies from requirejs
var system = {

  // used to toggle the game
  toggle : function()
  {
    var button = document.getElementById('switch');

    if( button.className.indexOf('active') === -1 )
      button.className = button.className + ' active';
    else
      button.className = button.className.substr( 0, button.className.indexOf( ' active' ));

    this.clock.toggle();
  }
};

// RequireJS configuration
requirejs.config({
  baseUrl: 'js'
});

// RequireJS initialization
requirejs (
  [ 'models/ViewController', 'models/Clock', 'models/World', 'models/Tools', 'models/Vector', 'models/DNA', 'lib/underscore', 'lib/jquery' ],
  function ( ViewController, Clock, World, Tools, Vector, DNA )
  {
    // save references to useful objects in the global scope
    system.world  = World;
    system.clock  = Clock;
    system.setStage = ViewController.setStage();

    // create initial agents / bugs
    _( 2 ).times( function(){
      World.add( 'Bug',
      {
        // initial position and state
        location : new Vector().randomize( 100 ),
        velocity : new Vector().randomize( -10, 10 ),
        
        // motion properties
        maxSpeed  : Math.round( _.random( 1, 3 )),
        cornering : _.random( 0.2, 0.5 ),
        dodgeSize : _.random( 0, 10 ),
        dodgeRate : _.random( 0, 2 ),

        // reproduction properties
        birthPeriod : 10,
        birthSize : 2
      });
    });

    // initialize the stage
    $(document).ready(function(){
      ViewController.setStage();
    });
  }
);