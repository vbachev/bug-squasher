var // globals for convenience <slap on the wrist>
STAGE_HEIGHT,
STAGE_WIDTH,
// object to host dependecies from requirejs
system = {

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
  [ 'models/ViewController', 'models/Clock', 'models/World', 'models/Vector', 'lib/underscore', 'lib/jquery' ],
  function ( ViewController, Clock, World, Vector )
  {
    // save references to useful objects in the global scope
    system.world    = World;
    system.clock    = Clock;
    system.setStage = ViewController.setStage();
   
    $(document).ready(function()
    {
      // initialize the stage
      ViewController.setStage();

      // create initial agents / bugs
      _( 5 ).times( function(){
        World.add( 'Bug',
        {
          // initial position and state
          location : new Vector(
            _.random( 10, STAGE_WIDTH -10 ),
            _.random( 10, STAGE_HEIGHT-10 )
          ),
          velocity : new Vector().randomize( -10, 10 ),
          
          // motion properties
          maxSpeed  : Math.round( _.random( 1, 2 )),
          cornering : _.random( 0.1, 0.5 ),
          dodgeSize : _.random( 0, 10 ),
          dodgeRate : _.random( 1, 2 ),

          // reproduction properties
          birthPeriod : 10,
          birthSize : 2
        });
      });

    });
  }
);