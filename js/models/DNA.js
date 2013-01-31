define( function ()
{
  // DNA class
  // ======================================================================
  // Stores genes and provides methods for mutation
  //
  function DNA ( a_genes )
  {
    // collect all genes that were passed
    this.genes = a_genes;
    return this;
  }

  // static properties that affect all instances of this class
  DNA.prototype.mutationAmount = 20; // % increases/decreases of property values
  DNA.prototype.mutationChance = 20; // % chance of mutation occuring

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