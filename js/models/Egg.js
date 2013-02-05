define(
  [ 'Tools', 'World', 'models/Vector', 'models/DNA' ],
  function ( Tools, World, Vector, DNA )
{
  // Egg class
  // ======================================================================
  // Created when a bug reproduces this class handles gene inheritance
  // and creating new bugs. Uses the DNA class to handle genes
  //
  function Egg ( a_parent )
  {
    if( !a_parent ){
      Tools.log( 'cannot create egg with no parent', 2 );
      return {};
    }

    // inerit parent's location
    this.location = a_parent.location.clone();

    // store parent's genes in a DNA object
    this.dna = new DNA( a_parent );

    this.childCount = Math.round(a_parent.birthSize);
    this.hatchAge   = Tools.convertSecondsToFrames( a_parent.hatchTime );

    // make sure the World module has been properly loaded
    World = World || require('World');

    return this;
  }

  Egg.prototype.update = function update ()
  {
    this.age++;

    // wait for the time to hatch
    if( this.age > this.hatchAge ){
      this.hatch();
    }
  };

  // create new bugs and destroy egg instance
  Egg.prototype.hatch = function hatch ()
  {
    var _this = this;
    Tools.iterate( this.childCount, function(){
      // mutate the DNA genes and add egg's location so it can all
      // be passed as a valid config object to the Agent constructor
      var newDna = _this.dna.getMutatedGeneset();
      newDna.location = _this.location.clone();

      World.add( 'Bug', newDna );
    });

    this.destroy();
  };

  return Egg;

});