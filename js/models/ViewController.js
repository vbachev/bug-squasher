define([ 'models/Topic' ], function ( Topic )
{
  // ViewController singleton class
  // ======================================================================
  // Used as a layer between the user's input and the model; Creates and
  // redraws the stage and all objects supplied by the World's registry;
  // Receives click events and dispatches them to the model layer
  //
  function ViewController ()
  {
    // ====================================================================
    // Initialization

    // singleton implementation
    if ( arguments.callee._singletonInstance )
      return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;

    Topic.subscribe( this, 'draw' );
    Topic.subscribe( this, 'clock' );

    // resize the stage when browser resizes
    // uses a delay to limit executions per second
    // 'this' will point to window and store the resizeHandle there
    window.onresize = function()
    {
      var smoothDelay = 300;
      if( this.resizeHandle ) clearTimeout( this.resizeHandle );
      this.resizeHandle = setTimeout( _resizeStage, smoothDelay );
    };

    // ====================================================================
    // Public members

    // called on document ready to set the stage for the game
    // saves a reference to the stage node and binds click handlers
    this.setStage = function ()
    {
      _stage.node = $('.stage');
      _resizeStage();

      // bind handler for clicks on the stage
      _stage.node.on('click', function(e)
      {
        // get browser's specific event properties
        var clickX = e.offsetX || e.originalEvent.layerX,
            clickY = e.offsetY || e.originalEvent.layerY;

        // inform subscribers and pass the click coords
        Topic.publish( 'click', { x: clickX, y: clickY });
      });
    };

    // handle subscription notifications
    this.update = function ( a_topic, a_data )
    {
      if( a_topic === 'draw' )
      {
        // add draw data to the stack
        _drawStack = _drawStack.concat( a_data );
      }
      else if ( a_topic === 'clock' )
      {
        // draw frame from the data in the stack
        _drawFrame();
      }
    };

    // ====================================================================
    // Private members
    
    var _drawStack = [], // will collect references to items that need to be displayed
        _stage = { // keeps information for the stage
          margin : 20
        };

    // called on window resize to adjust the stage accordingly
    function _resizeStage ()
    {
      var docWidth  = $('.wrapper').width(),
          docHeight = document.height,
          topOffset = $('.header').height() + $('.controls').height();

      // save dimensions locally and globally
      _stage.width  = STAGE_WIDTH  = docWidth;
      _stage.height = STAGE_HEIGHT = docHeight - topOffset - 50;
console.log(STAGE_HEIGHT, STAGE_WIDTH);
      _stage.node.css({
        'width'  : _stage.width +'px',
        'height' : _stage.height+'px'
      });
    }

    // trigerred by the clock object's rAF to redraw the stage
    // loops over the drawStack to collect data for each item
    // @TODO: maybe switch to canvas?
    function _drawFrame ()
    {
      var shadows = [];

      // add a box-shadow definition for each item
      _.each( _drawStack, function( item )
      {
        _checkEdges( item );

        var x = item.location.x || '0',
            y = item.location.y || '0',
            blur = item.view.blur || '0',
            size = item.view.size || 5,
            color = item.view.color || 'gray';
      
        shadows.push( x+'px '+y+'px '+blur+'px '+size+'px '+color );
        
        // for moving particles - add eye-candy
        // representing the velocity and dodge vectors with a little circle of 
        // the same color makes for a really cool worm/maggot like effect
        if( item.velocity )
        {
          // golden ratios :)
          var sizeRatio = 0.7,
          distanceRatio = 0.6,
          // circle radius
          r1 = size,
          r2 = r1*sizeRatio,
          r3 = r2*sizeRatio,
          // circle distance
          d1 = (r1+r2)*distanceRatio,
          d2 = (r2+r3)*distanceRatio,
          // circle position (vector)
          v2 = item.velocity.clone().normalize().mult( d1 ).add( item.location ),
          v3 = item.dodgeVector.clone().normalize().mult( d2 ).add( v2 );
          
          // add to frame drawing
          shadows.push( v2.x+'px '+v2.y+'px '+blur+'px '+r2+'px '+color );
          shadows.push( v3.x+'px '+v3.y+'px '+blur+'px '+r3+'px '+color );
        }
      });

      // apply to shadow projector element
      (document.getElementsByClassName('projector')[0]).style.boxShadow = shadows.join(', ');

      // empty the stack after all drawing is finished
      _drawStack = [];
    }

    // check if object is close to the edge (or outside)
    function _checkEdges ( a_object )
    {
      // if the object supports responding to edge proximity call its
      // handler method and pass n,e,s,w to indicate which side is near
      if( a_object.handleEdgeProximity )
      {
        var margin = _stage.margin;

        if ( a_object.location.x > _stage.width - margin )
          a_object.handleEdgeProximity('e');
        else if ( a_object.location.x < margin )
          a_object.handleEdgeProximity('w');
     
        if( a_object.location.y > _stage.height - margin )
          a_object.handleEdgeProximity('s');
        else if ( a_object.location.y < margin )
          a_object.handleEdgeProximity('n');
      }
    }

    return this;
  }

  // will always return a singleton
  return new ViewController();

});