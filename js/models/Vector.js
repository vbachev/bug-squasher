define( [ 'models/Tools' ], function ( Tools )
{
  // Vector constructor method
  function Vector ( a_x, a_y )
  {
    this.x = Tools.isNumber( a_x ) ? a_x : 0;
    this.y = Tools.isNumber( a_y ) ? a_y : 0;

    return this;
  }

  Vector.prototype.add = function add ( a_vector )
  {
    if( Tools.isVector( a_vector )) {
      this.x += a_vector.x;
      this.y += a_vector.y;
    } else {
      Tools.log( 'invalid vector addition', 2 );
    }

    return this;
  };

  Vector.prototype.sub = function ( a_vector )
  {
    if( Tools.isVector( a_vector )) {
      this.x -= a_vector.x;
      this.y -= a_vector.y;
    } else {
      Tools.log( 'invalid vector subtraction', 2 );
    }

    return this;
  };

  Vector.prototype.mult = function ( a_number )
  {
    if( Tools.isNumber( a_number )) {
      this.x *= a_number;
      this.y *= a_number;
    } else {
      Tools.log( 'invalid vector multiplication', 2 );
    }

    return this;
  };

  Vector.prototype.div = function ( a_number )
  {
    if( a_number !== 0 ) {
      this.mult( 1 / a_number );
    } else {
      Tools.log( 'division by zero', 2 );
    }

    return this;
  };

  Vector.prototype.mag = function ()
  {
    return Math.sqrt( this.x*this.x + this.y*this.y );
  };
  
  Vector.prototype.normalize = function ()
  {
    var m = this.mag();
    
    if( m ){
      this.div( m );
    }

    return this;
  };

  Vector.prototype.limit = function ( a_number )
  {
    if( Tools.isNumber( a_number )) {
      if( this.mag() > a_number ){
        this.normalize().mult( a_number );
      }
    } else {
      Tools.log( 'invalid vector limiting', 2 );
    }

    return this;
  };

  Vector.prototype.clone = function ()
  {
    return new Vector( this.x, this.y );
  };

  Vector.prototype.randomize = function ( a_from, a_to )
  {
    if( Tools.isNumber( a_from ))
    {
      if( !Tools.isNumber( a_to ))
      {
        a_to = null;
      }
    }
    else
    {
      a_from = -1;
      a_to   = 1;
    }

    this.x = _.random( a_from, a_to );
    this.y = _.random( a_from, a_to );

    return this;
  };

  Vector.prototype.mirror = function ( a_axis )
  {
    if( a_axis !== 'y' ) this.x *= -1;
    if( a_axis !== 'x' ) this.y *= -1;

    return this;
  };

  return Vector;
});