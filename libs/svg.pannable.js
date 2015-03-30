// svg.pannable.js based on svg.draggable.js 0.1.0 by Wout Fierens
// Autor: Carlos Galarza (carloslfu@gmail.com)
;(function() {

  SVG.extend(SVG.Element, {
    // Make element a pannable area
    // Constraint might be a object (as described in readme.md) or a function in the form "function (x, y)" that gets called before every move.
    // The function can return a boolean or a object of the form {x, y}, to which the element will be moved. "False" skips moving, true moves to raw x, y.
    pannable: function(context, constraint, attachToEls, pannableEls) { // exceptions are no pannable elements
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
          for (var i = 0; i < pannableEls.length; i++) {
            var child = pannableEls[i];
            var rotation  = context.absoluteRotation * Math.PI / 180;
            var bbox = {
              x: child.x(),
              y: child.y()
            };
            var ddx = (event.ddx * Math.cos(rotation) + event.ddy * Math.sin(rotation)) / context.absoluteScale;
            var ddy = (event.ddy * Math.cos(rotation) + event.ddx * Math.sin(-rotation)) / context.absoluteScale;
            /* caculate new position [with rotation correction] */
            x = bbox.x + ddx;
            y = bbox.y + ddy;

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

        /* invoke any callbacks */
        if (element.panend)
          element.panend(delta, event)
        event.stopPropagation();
      }
      
      /* bind mousedown event */
      attachToEls.forEach(function(el) {
        PolymerGestures.addEventListener(el.node, 'trackstart', startPan);
        PolymerGestures.addEventListener(el.node, 'track', pan);
        PolymerGestures.addEventListener(el.node, 'trackend', endPan);
        //fix pointerdown event (down in PolymerGestures)
        PolymerGestures.addEventListener(el.node, 'down', function(e){
          e.preventDefault(); // don't select text with mouse
        });
      });
      
      /* disable panable */
      element.fixedPan = function() {
        attachToEls.forEach(function(el) {
          PolymerGestures.removeEventListener(el.node, 'trackstart', startPan);
          PolymerGestures.removeEventListener(el.node, 'track', pan);
          PolymerGestures.removeEventListener(el.node, 'trackend', endPan);
        });
        
        startPan = pan = endPan = null
        
        return element
      }
      
      return this
    }
    
  })

}).call(this);