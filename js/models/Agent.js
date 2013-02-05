define(
  [ 'Tools', 'models/Vector', 'World' ],
  function ( Tools, Vector, World )
{
  // Agent / Bug class
  // ======================================================================
  // Represents the active entities in the game; It moves randomly,
  // reproduces and evolves
  //
  function Agent ( a_config )
  {
    // set defaults
    this.velocity     = new Vector();
    this.acceleration = new Vector();
    this.dodgeVector  = new Vector(); // random wandering behaviour
    
    // Motion - properties affecting movement and behaviour
    this.mass         = 2;    // higher mass means more momentum
    this.maxSpeed     = 4;    // will not exceed this speed
    this.cornering    = 1.5;  // increase to allow making tighter turns
    this.dodgeSize    = 1;    // increase will make dodges sharper
    this.dodgeRate    = 2;    // dodges per second

    // Birth - properties affecting life and reproduction
    this.birthPeriod  = 5;    // give birth every N seconds
    this.birthSize    = 2;    // give birth to N children
    this.hatchTime    = 5;    // time for an egg to hatch in seconds
    this.lifespan     = 20;   // bug's life expectation in seconds

    this.color        = [ 200, 10, 10 ];

    this.ageOfDeath     = Tools.convertSecondsToFrames( this.lifespan );
    this.ageOfNextBirth = Tools.convertSecondsToFrames( this.birthPeriod );

    // apply and override properties with those provided
    _.extend( this, a_config || {} );

    // make sure the World module has been properly loaded
    World = World || require('World');

    return this;
  }

  // handle subscription updates
  Agent.prototype.update = function ( a_topic, a_data )
  {
    this.age++;

    // reset acceleration at each update
    this.acceleration.mult(0);

    // apply global forces if provided
    if( Tools.isVector( a_data )){
      this.applyForce( a_data );
    }

    // handle reproduction, life and death
    this.handleReproduction();

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
    if( Tools.random( 60 / this.dodgeRate ) < 1 )
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
    if( this.age > this.ageOfNextBirth )
    {
      // give birth
      // create an egg object and pass its parent
      World.add( 'Egg', this );

      // stop movement
      this.velocity.mult(0);
      this.acceleration.mult(0);

      // set time for next birth
      this.ageOfNextBirth += Tools.convertSecondsToFrames( this.birthPeriod );
    }

    // die when time comes
    if( this.age > this.ageOfDeath )
    {
      this.destroy();
    }
  };

  return Agent;
});