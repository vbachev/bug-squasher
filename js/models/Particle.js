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
    this.id       = _.uniqueId();
    this.type     = a_type;
    this.location = new Vector();

    // make sure the World module has been properly loaded
    World = World || require('models/World');

    return this;
  }

  Particle.prototype.destroy = function ()
  {
    World.unregister( this );
  };

  return Particle;
});