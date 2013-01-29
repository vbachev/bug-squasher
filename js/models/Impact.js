define(
  [ 'models/Tools', 'models/World', 'models/Topic' ],
  function ( Tools, World, Topic )
{

  var Impact = function Impact ( a_config )
  {
    // make sure the World module has been properly loaded
    World = World || require('models/World');

    this.created = new Date().getTime();

    this.location = a_config.location.clone() || new Vector();

    this.view = {
      size : 20,
      color: 'rgba(0,0,255,.3)',
      blur : 0
    };

  };

  Impact.prototype.update = function ()
  {
    // fade out
    this.view.blur += 0.5;
    if( this.view.blur > 15 )
    {
      this.destroy();
    }
  };

  Impact.prototype.destroy = function ()
  {
    World.unregister( this );
  };

  return Impact;

});