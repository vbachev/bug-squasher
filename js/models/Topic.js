define( function ()
{
  // Topic singleton class
  // ======================================================================
  // Implements simple observer pattern with subscribers and publishers
  //
  function Topic ()
  {
    // ====================================================================
    // Initialization

    // singleton implementation
    if ( arguments.callee._singletonInstance )
      return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;

    // ====================================================================
    // Public members

    this.id = _.uniqueId();
    
    this.subscribe = function subscribe ( a_object, a_topic )
    {
      // create new topic
      if( !_subscribers[ a_topic ] ){
        _subscribers[ a_topic ] = [];
      }

      _subscribers[ a_topic ].push( a_object );
    };

    this.unsubscribe = function unsubscribe ( a_object, a_topic )
    {
      var unsubscribed = 0;

      if( !_subscribers[ a_topic ] ){
        return unsubscribed;
      }

      _.each( _subscribers[ a_topic ], function( item, index, list ){
        // find the subscriber object by its ID
        if( item.id === a_object.id ){
          list.splice( index, 1 );
          unsubscribed++;
        }
      });

      // return number of unsubscribed objects
      return unsubscribed;
    };

    this.publish = function publish ( a_topic, a_data )
    {
      if( !_subscribers[ a_topic ] ){
        return;
      }

      // notify all _subscribers
      _.each( _subscribers[ a_topic ], function( item, index, list )
      {
        // if object supports it update it with the passed data
        if( item.update ){
          item.update( a_topic, a_data );
        }
      });
    };

    // ====================================================================
    // Private members

    var _subscribers = {};

    return this;
  }

  // will always return a singleton
  return new Topic();
  
});