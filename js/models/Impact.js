define(
  [ 'models/Tools', 'models/World', 'models/Topic' ],
  function ( Tools, World, Topic )
{
  // Impact class
  // ======================================================================
  // Created by a click event and used to interact with other particles
  //
  var Impact = function Impact ( a_config )
  {
    this.location = a_config.location.clone();
    this.created = new Date().getTime();

    // Template - information on how to display this object
    this.view = {
      size : 20,
      color: 'rgba(0,0,255,.3)',
      blur : 0
    };

    // make sure the World module has been properly loaded
    World = World || require('models/World');

    return this;
  };

  // event listener triggered by World
  Impact.prototype.update = function ()
  {
    // fade out
    this.view.blur += 0.5;
    if( this.view.blur > 15 )
    {
      this.destroy();
    }

    this.handleCollisions();
  };

  // check for collisions with other particles
  Impact.prototype.handleCollisions = function ()
  {
    var distance,
    _this = this; // save reference to self

    // destroy bugs that collide
    _.each(
      World.getRegistryItemsByType( 'Bug' ),
      function( target )
      {
        distance = _this.location.clone().sub( target.location ).mag();
        if( distance < _this.view.size ){
          target.destroy();
        }
      }
    );
  };

  return Impact;

});