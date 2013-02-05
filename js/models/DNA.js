define([ 'Tools' ], function ( Tools )
{
  // DNA class
  // ======================================================================
  // Stores genes and provides methods for mutation
  //
  function DNA ( a_source )
  {
    // collect all genes (selectively) that were passed
    this.genes = {
      // template properties
      color       : a_source.color,
      
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
  DNA.prototype.mutationAmount = 10; // % increases/decreases of property values
  DNA.prototype.mutationChance = 50; // % chance of mutation occuring

  // returns mutated genes
  DNA.prototype.getMutatedGeneset = function getMutatedGeneset ()
  {
    var key,
    result = {};

    for( key in this.genes )
    {
      if( Tools.random( 100 ) < this.mutationChance && key !== 'color' ){
        result[ key ] = this.mutateGene( this.genes[ key ]);
      }
      result.color = this.mutateColor( this.genes.color );
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

  DNA.prototype.mutateColor = function mutateColor ( a_color )
  {
    var result = [0,0,0],
    colorMutationAmount = 50, // step for color mutation
    inverter = Math.round(Math.random())*2-1, // +1 or -1
    modifier = colorMutationAmount * inverter;

    for ( i = 0; i < 3; i++ )
    {
      result[i] = Math.min( 200, Math.max( 0, a_color[i] + modifier ));
    }

    return result;
  };

  return DNA;
});