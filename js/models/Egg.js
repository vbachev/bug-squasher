define(
  [ 'models/Tools', 'models/Topic', 'models/World', 'models/Vector', 'models/DNA' ],
  function ( Tools, Topic, World, Vector, DNA )
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
    this.dna = new DNA({
      // view properties
      //view     : {
      // size  : a_parent.view.size,
      // color : a_parent.view.color,
      // blur  : a_parent.view.blur,
      //},
      
      // motion properties
      maxSpeed    : a_parent.maxSpeed,
      cornering   : a_parent.cornering,
      dodgeSize   : a_parent.dodgeSize,
      dodgeRate   : a_parent.dodgeRate,

      // reproduction properties
      birthPeriod : a_parent.birthPeriod,
      birthSize   : a_parent.birthSize,
      hatchTime   : a_parent.hatchTime,
      lifespan    : a_parent.lifespan
    });

    // Template - information on how to display this object
    this.view = {
      size : 5,
      blur : 5,
      color: 'rgba(0,250,0,.3)'
    };

    this.created    = new Date().getTime();
    this.childCount = Math.round(a_parent.birthSize);
    this.hatchTime  = this.created + a_parent.hatchTime * 1000;

    // make sure the World module has been properly loaded
    World = World || require('models/World');

    return this;
  }

  Egg.prototype.update = function update ()
  {
    // wait for the time to hatch
    if( new Date().getTime() > this.hatchTime ){
      this.hatch();
    }
  };

  // create new bugs and destroy egg instance
  Egg.prototype.hatch = function hatch ()
  {
    var _this = this;
    _( this.childCount ).times(function(){
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