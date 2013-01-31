define(
  [ 'models/World', 'models/Vector' ],
  function ( World, Vector )
{
  // Particle base class
  // ======================================================================
  // Acts as a basic interface for all objects concerned with interaction and
  // display on the stage
  //
  function Particle ( a_type )
  {
    this.type     = a_type; // a string representing the object type
    this.location = new Vector();
    this.age      = 0; // age measured in frames passed

    // make sure the World module has been properly loaded
    World = World || require('models/World');

    return this;
  }

  Particle.prototype.handleEdgeProximity = function ()
  {
    // by default dont allow particles to near or leave the edges
    this.destroy();
  };

  Particle.prototype.destroy = function ()
  {
    World.unregister( this );
  };

  return Particle;
});