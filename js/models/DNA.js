define( function ()
{
  // DNA class
  // ======================================================================
  // Stores genes and provides methods for mutation
  //
  function DNA ( a_source )
  {
    // collect all genes (selectively) that were passed
    this.genes = {
      // view properties
      //view     : {
      // size  : a_source.view.size,
      // color : a_source.view.color,
      // blur  : a_source.view.blur,
      //},
      
      // motion properties
      maxSpeed    : a_source.maxSpeed,
      cornering   : a_source.cornering,
      dodgeSize   : a_source.dodgeSize,
      dodgeRate   : a_source.dodgeRate,

      // reproduction properties
      birthPeriod : a_source.birthPeriod,
      birthSize   : a_source.birthSize,
      hatchTime   : a_source.hatchTime,
      lifespan    : a_source.lifespan
    };

    return this;
  }

  // static properties that affect all instances of this class
  DNA.prototype.mutationAmount = 20; // % increases/decreases of property values
  DNA.prototype.mutationChance = 30; // % chance of mutation occuring

  // returns mutated genes
  DNA.prototype.getMutatedGeneset = function getMutatedGeneset ()
  {
    var key,
    result = {};

    for( key in this.genes )
    {
      if( _.random( 100 ) < this.mutationChance ){
        result[ key ] = this.mutateGene( this.genes[ key ]);
      }
    }

    return result;
  };

  // mutate a single gene
  DNA.prototype.mutateGene = function mutateGene ( a_gene )
  {
    // modify value by +/- N%
    // for example with 20% mutationAmount the modifier variable will be 1.2 or 0.8
    var divider = 100 / ( this.mutationAmount || 10 ),
        modifier = 1 + (Math.round(Math.random())*2-1) / divider;

    return a_gene * modifier;
  };

  return DNA;
});