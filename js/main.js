var system = {
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


requirejs.config({
  baseUrl: 'js'
});

requirejs (
  [ 'models/ViewController', 'models/Clock', 'models/World', 'models/Tools', 'models/Vector', 'lib/underscore', 'lib/jquery' ],
  function ( ViewController, Clock, World, Tools, Vector )
  {
    system.world  = World;
    system.clock  = Clock;
    system.setStage = ViewController.setStage();

    _( 1 ).times( function(){
      World.add( 'Bug',
      {
        // initial position and state
        location : new Vector().randomize( 100 ),
        velocity : new Vector().randomize( -10, 10 ),

        // view properties
        //size  : Math.round( _.random( 3, 6 )),
        //color : Tools.generateRandomColor(),
        //blur  : 0,
        
        // motion properties
        maxSpeed  : Math.round( _.random( 1, 3 )),
        cornering : _.random( 0.2, 0.5 ),
        dodgeSize : _.random( 0, 10 ),
        dodgeRate : _.random( 0, 2 ),

        // reproduction properties
        birthRate : 10,
        birthSize : 2
      });
    });

    $(document).ready(function(){
      ViewController.setStage();
    });
  }
);