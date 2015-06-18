// svg.draggable.js 0.1.0 - Copyright (c) 2014 Wout Fierens - Licensed under the MIT license
// extended by Florian Loch
// added PEP support and some modifications by: Carlos Galarza (carloslfu@gmail.com)
;(function() {

  SVG.extend(SVG.Element, {
    // Make element draggable
    // Constraint might be a object (as described in readme.md) or a function in the form "function (x, y)" that gets called before every move.
    // The function can return a boolean or a object of the form {x, y}, to which the element will be moved. "False" skips moving, true moves to raw x, y.
    draggable: function(context, constraint, attachToEls) {
      var startDrag, drag, endDrag
        , element = this
        , parent  = this._parent(SVG.Doc) || this.parent._parent(SVG.Nested);

      if (!attachToEls) {
        attachToEls = [element];
      }
      /* remove draggable if already present */
      if (typeof this.fixedDrag === 'function')
        this.fixedDrag();
      
      /* ensure constraint object */
      constraint = constraint || {}
      
      /* start dragging */
      startDrag = function(event) {
        event = event || window.event
        element.startEventDrag = event;

        /* invoke any callbacks */
        if (context.dragstart)
          BB.runCallbacks(context.dragstart, context, []);

        /* prevent selection dragging */
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        event.stopPropagation();
      }
      
      /* while dragging */
      drag = function(event) {
        event = event || window.event
        
        if (element.startEventDrag) {
          /* calculate move position */
          var rotation  = context.absoluteRotation * Math.PI / 180;
          var bbox = {
            x: element.x(),
            y: element.y()
          };
          var zoom = context.workspace.absoluteScale * context.workspace.scale;
          var ddx = (event.ddx * Math.cos(rotation) + event.ddy * Math.sin(rotation)) / zoom;
          var ddy = (event.ddy * Math.cos(rotation) + event.ddx * Math.sin(-rotation)) / zoom;
          /* caculate new position [with rotation correction] */
          x = bbox.x + ddx;
          y = bbox.y + ddy;
          if (typeof constraint === 'function') {
            var coord = constraint(x, y)

            if (typeof coord === 'object') {
              if (typeof coord.x != 'boolean' || coord.x)
                element.x(typeof coord.x === 'number' ? coord.x : x)
              if (typeof coord.y != 'boolean' || coord.y)
                element.y(typeof coord.y === 'number' ? coord.y : y)

            } else if (typeof coord === 'boolean' && coord) {
              element.move(x, y)
              // update context
              context.x = x;
              context.y = y;
            }

          } else if (typeof constraint === 'object') {
            /* keep element within constrained box */
            if (constraint.minX != null && x < constraint.minX)
              x = constraint.minX
            else if (constraint.maxX != null && x > constraint.maxX - width)
              x = constraint.maxX - width
            
            if (constraint.minY != null && y < constraint.minY)
              y = constraint.minY
            else if (constraint.maxY != null && y > constraint.maxY - height)
              y = constraint.maxY - height

            element.move(x, y)
            // update context
            context.x = x;
            context.y = y;
          }

          /* invoke any callbacks */
          if (context.dragmove)
            BB.runCallbacks(context.dragmove, context, [ddx, ddy]);
        }
        event.stopPropagation();
      }
      
      /* when dragging ends */
      endDrag = function(event) {
        event = event || window.event

        /* reset store */
        element.startEventDrag    = null
        element.startPositionDrag = null

        /* invoke any callbacks */
        if (context.dragend)
          BB.runCallbacks(context.dragend, context, []);
        event.stopPropagation();
      }
      
      /* bind mousedown event */
      attachToEls.forEach(function(el) {
        PolymerGestures.addEventListener(el.node, 'trackstart', startDrag);
        PolymerGestures.addEventListener(el.node, 'track', drag);
        PolymerGestures.addEventListener(el.node, 'trackend', endDrag);
        //fix pointerdown event (down in PolymerGestures)
        PolymerGestures.addEventListener(el.node, 'down', function(e){
          e.preventDefault(); // don't select text with mouse
        });
      });
      
      /* disable draggable */
      element.fixedDrag = function() {
        attachToEls.forEach(function(el) {
          PolymerGestures.removeEventListener(el.node, 'trackstart', startDrag);
          PolymerGestures.removeEventListener(el.node, 'track', drag);
          PolymerGestures.removeEventListener(el.node, 'trackend', endDrag);
        });
        
        startDrag = drag = endDrag = null
        
        return element
      }
      
      return this
    }
    
  })

}).call(this);