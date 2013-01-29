define(
  [ 'models/Tools', 'models/Topic', 'models/World', 'models/Vector' ],
  function ( Tools, Topic, World, Vector )
{
  
  function Egg ( a_parent )
  {
    if( !a_parent ){
      Tools.log( 'cannot create egg with no parent', 2 );
      return {};
    }

    // make sure the World module has been properly loaded
    World = World || require('models/World');

    this.created = new Date().getTime();

    this.location = a_parent.location.clone() || new Vector();
    this.view = {
      size : 5,
      blur : 5,
      color: 'rgba(0,250,0,.3)'
    };

    this.dna = {
      // view properties
      size  : a_parent.size,
      // color : a_parent.color,
      // blur  : a_parent.blur,
      
      // motion properties
      maxSpeed  : a_parent.maxSpeed,
      cornering : a_parent.cornering,
      dodgeSize : a_parent.dodgeSize,
      dodgeRate : a_parent.dodgeRate,

      // reproduction properties
      birthRate : a_parent.birthRate,
      birthSize : a_parent.birthSize
    };

    this.childCount    = Math.round(a_parent.birthSize);
    this.hatchTime    = this.created + 5 * 1000;

    return this;
  }

  Egg.prototype.update = function update ()
  {
    if( new Date().getTime() > this.hatchTime ){
      this.hatch();
    }
  };

  Egg.prototype.hatch = function hatch ()
  {
    var i;
    for( i = 0; i < this.childCount; i++ ){
      // mutate the DNA genes and add egg's location so it can all
      // be passed as a valid config object to the Agent constructor
      var newDna = this.getMutatedDna();
      newDna.location = this.location.clone();

      World.add( 'Bug', newDna );
      //new Agent( newDna );
    }

    this.destroy();
  };

  Egg.prototype.getMutatedDna = function getMutatedDna ()
  {
    var key,
    result = {};

    function mutate ( a_gene, a_percent )
    {
      // modify value by +/- N%
      // by default modifier will be either 1.1 or 0.9
      var divider = 100 / (a_percent || 10),
          modifier = 1 + (Math.round(Math.random())*2-1) / divider;

      return a_gene * modifier;
    }

    for( key in this.dna )
    {
      result[ key ] = mutate( this.dna[ key ], 50 );
    }

    return result;
  };

  Egg.prototype.destroy = function destroy ()
  {
    World.unregister( this );
  };

  return Egg;

});