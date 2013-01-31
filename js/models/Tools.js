define( function()
{
  // Tools
  // ======================================================================
  // A collection of useful methods
  //
  return {

    isVector : function ( a_argument )
    {
      return a_argument.__proto__.constructor.name === 'Vector' ? true : false;
    },

    isNumber : function ( a_argument )
    {
      return typeof a_argument === 'number' ? true : false;
    },

    // kind of useless method but it seemed reasonable at the time :D
    convertSecondsToFrames : function ( a_seconds )
    {
      // we are working at ~60fps
      return a_seconds * 60; // Doh!
    },

    // generates a random 8bit color
    // http://paulirish.com/2009/random-hex-color-code-snippets/
    generateRandomColor : function ()
    {
      return '#' + Math.floor(Math.random()*4096).toString(16);
    },

    log : function ( a_msg, a_type )
    {
      var types = ['info', 'warning', 'error'],
      info = {
        source : arguments.callee.caller.name,
        args : arguments.callee.caller.arguments
      },
      entry = {
        type: types[( a_type || 0 )],
        message : a_msg,
        details : info,
        time : new Date()
      };
      
      // // record entries in the object itself
      // if( typeof debug.log === 'object' ){
      //   debug.log.push(entry);
      // } else {
      //   debug.log = [entry];
      // }
      
      // if requested show debug messages
      if( this.debug ){
        if( a_type === 2 ){
          console.error( entry.message, entry.details, entry.time.toLocaleString() );
        } else if ( a_type === 1 ){
          console.warn( entry.message, entry.details, entry.time.toLocaleString() );
        } else {
          console.log( entry.message, entry.details, entry.time.toLocaleString() );
        }
      }
    },

    debug : true
  };
});