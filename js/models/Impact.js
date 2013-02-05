define(
  [ 'Tools', 'World', 'Topic' ],
  function ( Tools, World, Topic )
{
  // Impact class
  // ======================================================================
  // Created by a click event and used to interact with other particles
  //
  var Impact = function Impact ( a_config )
  {
    this.location = a_config.location.clone();
    this.radius   = 20; // impact radius - used for collision detection
    this.duration = 1;  // time in seconds

    // make sure the World module has been properly loaded
    World = World || require('World');

    this.ageOfDeath = Tools.convertSecondsToFrames( this.duration );
    this.handleEdgeProximity = function(){}; // disable inherited method

    return this;
  };

  // event listener triggered by World
  Impact.prototype.update = function ()
  {
    this.age++;
    if( this.age > this.ageOfDeath )
    {
      this.destroy();
    }

    this.handleCollisions();
  };

  // override inherited method to disable edge limitations
  Impact.prototype.handleEdgeProximity = function (){};

  // check for collisions with other particles
  Impact.prototype.handleCollisions = function ()
  {
    var distance,
    _this = this; // save reference to self

    // destroy bugs that collide
    $.each(
      World.getRegistryItemsByType( 'Bug' ),
      function( index, target )
      {
        distance = _this.location.clone().sub( target.location ).mag();
        if( distance < _this.radius ){
          target.destroy();
        }
      }
    );
  };

  return Impact;

});