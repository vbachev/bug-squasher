define(
  [ 'models/Tools', 'models/Vector', 'models/World' ],
  function ( Tools, Vector, World )
{

  function Agent ( a_config )
  {
    a_config = a_config || {};

    // make sure the World module has been properly loaded
    World = World || require('models/World');

    this.created      = new Date().getTime();
    this.timeOfDeath  = this.created + 20 * 1000;

    this.location     = a_config.location || new Vector();
    this.velocity     = a_config.velocity || new Vector();
    this.acceleration = new Vector();
    this.maxSpeed     = a_config.maxSpeed || 4; // will not exceed this speed
    this.cornering    = a_config.cornering|| 1.5; // increase to allow making tighter turns
    this.mass         = 2; // higher mass means more momentum

    // Dodging - random wandering behaviour
    this.dodgeVector  = new Vector();
    this.dodgeSize    = a_config.dodgeSize || 1; // increase will make dodges sharper
    this.dodgeRate    = a_config.dodgeRate || 2; // dodges per second

    this.birthRate    = a_config.birthRate || 5; // give birth every N seconds
    this.birthSize    = a_config.birthSize || 2; // give birth to N children
    this.nextBirth    = this.created + this.birthRate * 1000;

    // information on how to display this object
    this.view = {
      size  : a_config.size  || '10',
      blur  : a_config.blur  || '0',
      color : a_config.color || 'red'
    };

    return this;
  }

  // handle subscription updates
  Agent.prototype.update = function ( a_topic, a_data )
  {
    // reset acceleration at each update
    this.acceleration.mult(0);

    // apply global forces provided by World
    if( Tools.isVector( a_data )){
      this.applyForce( a_data );
    }

    // handle reproduction and death
    this.handleReproduction();

    this.handleImpacts();

    // calculate random wandering
    this.applyBehavior();

    // move
    this.velocity.add( this.acceleration ).limit( this.maxSpeed );
    this.location.add( this.velocity );
  };

  // applies a force vector to general acceleration
  Agent.prototype.applyForce = function ( a_force )
  {
    if( Tools.isVector( a_force ))
    {
      // initialize a new vector object to lose the reference to the original object
      var effectiveForce = a_force.clone().div( this.mass );
      this.acceleration.add( effectiveForce );
    }
    else
    {
      Tools.log( 'invalid force application', 2 );
    }

    return this;
  };

  // calculates and applies a specific agent behaviour
  Agent.prototype.applyBehavior = function applyBehaviour ()
  {
    // calculate dodge chance at 60fps
    if( _.random( 60 / this.dodgeRate ) < 1 )
    {
      // implement Reynolds' wandering behaviour
      // the dodgeSize value is used in such a way as to keep the resultin
      // range of wandering behaviour between 0 and 180 degrees while
      // dodgeSize itself varies between 0 and infinity
      var dodgeRadius = 10,
          dodgeLength = dodgeRadius * ( 1 + 1 / this.dodgeSize ),
          leader      = this.velocity.clone().normalize().mult( dodgeLength );
          pendulum    = new Vector().randomize().normalize().mult( dodgeRadius );

      // save it in the dodgeVector property
      this.dodgeVector = leader.add( pendulum );
    }

    // use the dodgeVector to steer the agent in the desired direction
    var steeringVector = this.dodgeVector.clone().sub( this.velocity );
    this.applyForce( steeringVector.limit( this.cornering ));
  };

  // used to inform the agent when nearing an edge
  // avoids the edge by modifieing the dodgeVector
  Agent.prototype.handleEdgeProximity = function ( a_direction )
  {
    switch ( a_direction )
    {
      case 'n':
        this.dodgeVector.y = this.maxSpeed;
        break;

      case 'e':
        this.dodgeVector.x = -1 * this.maxSpeed;
        break;

      case 's':
        this.dodgeVector.y = -1 * this.maxSpeed;
        break;

      case 'w':
        this.dodgeVector.x = this.maxSpeed;
        break;
    }
  };

  Agent.prototype.handleReproduction = function handleReproduction ()
  {
    var now = new Date().getTime();
    if( now > this.nextBirth )
    {
      // give birth
      // create an egg object and pass its parent
      World.add( 'Egg', this );

      // stop movement
      this.velocity.mult(0);
      this.acceleration.mult(0);

      this.nextBirth = now + this.birthRate * 1000;
    }

    if( now > this.timeOfDeath )
    {
      this.destroy();
    }
  };

  Agent.prototype.handleImpacts = function ()
  {
    var i, l, item, distance,
    impactObjects = _.filter(
      World.getRegistry(),
      function( item ){
        return item.type === 'Impact';
      }
    );

    for( i = 0, l = impactObjects.length; i < l; i++ )
    {
      item = impactObjects[ i ];
      distance = this.location.clone().sub( item.location ).mag();
      if( distance < item.view.size ){
        this.destroy();
      }
    }
  };

  Agent.prototype.destroy = function destroy ()
  {
    World.unregister( this );
  };

  return Agent;
});