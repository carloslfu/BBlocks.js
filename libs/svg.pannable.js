// svg.pannable.js based on svg.draggable.js 0.1.0 by Wout Fierens
// Autor: Carlos Galarza (carloslfu@gmail.com)
;(function() {

  SVG.extend(SVG.Element, {
    // Make element a pannable area
    // Constraint might be a object (as described in readme.md) or a function in the form "function (x, y)" that gets called before every move.
    // The function can return a boolean or a object of the form {x, y}, to which the element will be moved. "False" skips moving, true moves to raw x, y.
    pannable: function(context, constraint, attachToEls, exceptions) { // exceptions are no pannable elements
      var startPan, pan, endPan
        , element = this
        , parent  = this._parent(SVG.Doc) || this.parent._parent(SVG.Nested);

      if (!attachToEls) {
        attachToEls = [element];
      }
      /* remove pangable if already present */
      if (typeof this.fixedPan === 'function')
        this.fixedPan();
      
      /* ensure constraint object */
      constraint = constraint || {};
      
      /* start panning */
      startPan = function(event) {
        event = event || window.event

        /* invoke any callbacks */
        if (element.beforepan)
          element.beforepan(event);
        
        /* store event */
        element.startEventPan = event;

        /* get children bounding boxes */
        element.startPositionsPan = [];
        element.each(function (i, children) {
          var child = this;
          var box = child.bbox()
          
          if (child instanceof SVG.G) {
            box.x = child.x()
            box.y = child.y()
            
          } else if (child instanceof SVG.Nested) {
            box = {
              x:      child.x()
            , y:      child.y()
            , width:  child.width()
            , height: child.height()
            }
          }
          
          /* store start position */
          element.startPositionsPan[i] = {
            x:        box.x
          , y:        box.y
          , width:    box.width
          , height:   box.height
          , zoom:     context.absoluteScale
          , rotation: element.transform('rotation') * Math.PI / 180
          }
        });
        /* add while and end events to window */
        window.addEventListener('pointermove', pan);
        window.addEventListener('pointerup', endPan);
        
        /* invoke any callbacks */
        if (element.panstart)
          element.panstart({zoom: element.startPositionsPan}, event)
        
        /* prevent selection panning */
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        event.stopPropagation();
      }
      
      /* while panning */
      pan = function(event) {
        event = event || window.event
        
        if (element.startEventPan) {
          /* calculate move position for all children*/
          element.each(function (i, children) {
            if (exceptions.indexOf(this) == -1) {
              var child = this;
              var x, y
                , rotation  = element.startPositionsPan[i].rotation
                , width     = element.startPositionsPan[i].width
                , height    = element.startPositionsPan[i].height
                , delta     = {
                    x:    event.pageX - element.startEventPan.pageX,
                    y:    event.pageY - element.startEventPan.pageY,
                    zoom: element.startPositionsPan[i].zoom
                  }
              
              /* caculate new position [with rotation correction] */
              x = element.startPositionsPan[i].x + (delta.x * Math.cos(rotation) + delta.y * Math.sin(rotation))  / element.startPositionsPan[i].zoom;
              y = element.startPositionsPan[i].y + (delta.y * Math.cos(rotation) + delta.x * Math.sin(-rotation)) / element.startPositionsPan[i].zoom;
              
              /* move the child to its new position, if possible by constraint */
              if (typeof constraint === 'function') {
                var coord = constraint(x, y)

                if (typeof coord === 'object') {
                  if (typeof coord.x != 'boolean' || coord.x)
                    child.x(typeof coord.x === 'number' ? coord.x : x)
                  if (typeof coord.y != 'boolean' || coord.y)
                    child.y(typeof coord.y === 'number' ? coord.y : y)

                } else if (typeof coord === 'boolean' && coord) {
                  child.move(x, y)
                }

              } else if (typeof constraint === 'object') {
                /* keep child within constrained box */
                if (constraint.minX != null && x < constraint.minX)
                  x = constraint.minX
                else if (constraint.maxX != null && x > constraint.maxX - width)
                  x = constraint.maxX - width
                
                if (constraint.minY != null && y < constraint.minY)
                  y = constraint.minY
                else if (constraint.maxY != null && y > constraint.maxY - height)
                  y = constraint.maxY - height

                child.move(x, y)          
              }

              /* invoke any callbacks */
              if (element.panmove)
                element.panmove(delta, event)
            }
          });
        }
        event.stopPropagation();
      }
      
      /* when panning ends */
      endPan = function(event) {
        event = event || window.event
        
        /* calculate move position */
        var delta = {
          x:    event.pageX - element.startEventPan.pageX
        , y:    event.pageY - element.startEventPan.pageY
        , zoom: parent.viewbox().zoom
        }
        
        /* reset store */
        element.startEventPan    = null
        element.startPositionsPan = null

        /* remove while and end events to window */
        window.removeEventListener('pointermove', pan);
        window.removeEventListener('pointerup', endPan);

        /* invoke any callbacks */
        if (element.panend)
          element.panend(delta, event)
        event.stopPropagation();
      }
      
      /* bind mousedown event */
      attachToEls.forEach(function(el) {
        el.node.addEventListener('pointerdown', startPan);
      });
      
      /* disable panable */
      element.fixedPan = function() {
        attachToEls.forEach(function(el) {
          el.node.removeEventListener('pointerdown', startPan);
        });
        
        window.removeEventListener('pointermove', pan);
        window.removeEventListener('pointerup', endPan);
        
        startPan = pan = endPan = null
        
        return element
      }
      
      return this
    }
    
  })

}).call(this);