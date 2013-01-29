define(
  [ 'models/Tools', 'models/Topic', 'models/Vector', 'models/Agent', 'models/Egg', 'models/Impact' ],
  function ( Tools, Topic, Vector, Agent, Egg, Impact )
{
  // World singleton class
  // ======================================================================
  // Manages interactive objects (creation, updates and removal).
  // Communicates with the view controller to dispatch objects for
  // displaying and receives click events
  //
  function World ()
  {
    // ====================================================================
    // Initialization

    // singleton implementation
    if ( arguments.callee._singletonInstance )
      return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;

    // subscribe for clock events and click inputs
    Topic.subscribe( this, 'clock' );
    Topic.subscribe( this, 'click' );

    // ====================================================================
    // Public members

    this.id = _.uniqueId();

    // add an object to the register and subscribe it for world updates
    this.register = function ( a_object )
    {
      _registry.push( a_object );
      Topic.subscribe( a_object, 'world' );
    };

    // remove an object from the registry and unsubscribe it
    this.unregister = function ( a_object )
    {
      Topic.unsubscribe( a_object, 'world' );
      _registry = _.without( _registry, a_object );
    };

    this.getRegistry = function ()
    {
      return _registry;
    },

    // updates all registered objects
    // schedules objects for drawing
    // handles object creation
    this.update = function ( a_topic, a_data )
    {
      if( a_topic === 'click' ){
        this.add( 'Impact', { location: new Vector( a_data.x, a_data.y )});
        return;
      }

      // update world objects
      Topic.publish( 'world', _force );

      // pass world objects to be displayed
      Topic.publish( 'draw', _registry );
    };

    // Abstract factory implementation
    // creates objects on demand
    this.add = function ( a_type, a_config )
    {
      var instance = false,
      classes = {
        Bug    : Agent,
        Egg    : Egg,
        Impact : Impact
      };

      // limit number of objects
      if( ( _canSustainMoreAgents() || a_type === 'Impact' ) && classes[ a_type ] )
      {
        instance = new classes[ a_type ]( a_config );

        instance.id = _.uniqueId();
        instance.type = a_type;
        //instance.view = ViewController.getTemplate( this );
        
        this.register( instance );
      }

      return instance;
    };

    // ====================================================================
    // Private members

    var _force = new Vector( 0, 0 ), // stub vector
        _maxAgents = 100,
        _registry = []; // holds all registered objects

    function _canSustainMoreAgents ()
    {
      return _registry.length > _maxAgents ? false : true;
    }

    return this;
  }

  // will always return a singleton
  return new World();

});