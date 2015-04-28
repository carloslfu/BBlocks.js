// svg.resizable.js based on svg.draggable.js 0.1.0 by Wout Fierens
// Autor: Carlos Galarza (carloslfu@gmail.com)
;(function() {

  SVG.extend(SVG.Element, {
    // Make element resizable
    // Constraint might be a object (as described in readme.md) or a function in the form "function (x, y)" that gets called before every move.
    // The function can return a boolean or a object of the form {x, y}, to which the element will be moved. "False" skips moving, true moves to raw x, y.
    resizable: function(context, constraint, attachToEls) {
      var startResize, resize, endResize, initialWidth, initialHeight
        , element = this
        , parent  = this._parent(SVG.Doc) || this.parent._parent(SVG.Nested);

      if (!attachToEls) {
        attachToEls = [element];
      }
      /* remove resizable if already present */
      if (typeof this.fixedResize === 'function')
        this.fixedResize();
      
      /* ensure constraint object */
      constraint = constraint || {}
      
      /* start resizing */
      startResize = function(event) {
        event = event || window.event

        initialWidth = context.width;
        initialHeight = context.height;
        
        /* store event */
        element.startEventResize = event

        /* invoke any callbacks */
        if (context.resizestart)
          context.resizestart(event)

        /* prevent selection resizing */
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        event.stopPropagation();
      }
      
      /* while resizing */
      resize = function(event) {
        event = event || window.event
        
        if (element.startEventResize) {
          /* calculate move position */
          var rotation  = context.absoluteRotation * Math.PI / 180;
          var zoom = context.workspace.absoluteScale * context.workspace.scale;
          var ddx = (event.ddx * Math.cos(rotation) + event.ddy * Math.sin(rotation)) / zoom;
          var ddy = (event.ddy * Math.cos(rotation) + event.ddx * Math.sin(-rotation)) / zoom;
          var dx = (event.dx * Math.cos(rotation) + event.dy * Math.sin(rotation)) / zoom;
          var dy = (event.dy * Math.cos(rotation) + event.dx * Math.sin(-rotation)) / zoom;
          
          //TODO: constraints
          if (initialWidth + dx >= 0) {
            context.setWidth(initialWidth + dx);
          }
          if (initialHeight + dy >= 0) {
            context.setHeight(initialHeight + dy);
          }

          /* invoke any callbacks */
          if (context.resizemove)
            context.resizemove(event)
        }
        event.stopPropagation();
      }
      
      /* when resizing ends */
      endResize = function(event) {
        event = event || window.event

        /* reset store */
        element.startEventResize    = null
context
        /* invoke any callbacks */
        if (context.resizeend)
          context.resizeend(event);
        event.stopPropagation();
      }
      
      /* bind mousedown event */
      attachToEls.forEach(function(el) {
        PolymerGestures.addEventListener(el.node, 'trackstart', startResize);
        PolymerGestures.addEventListener(el.node, 'track', resize);
        PolymerGestures.addEventListener(el.node, 'trackend', endResize);
        //fix pointerdown event (down in PolymerGestures)
        PolymerGestures.addEventListener(el.node, 'down', function(e){
          e.preventDefault(); // don't select text with mouse
        });
      });
      
      /* disable resizable */
      element.fixedResize = function() {
        attachToEls.forEach(function(el) {
          PolymerGestures.removeEventListener(el.node, 'trackstart', startResize);
          PolymerGestures.removeEventListener(el.node, 'track', resize);
          PolymerGestures.removeEventListener(el.node, 'trackend', endResize);
        });
        
        startResize = resize = endResize = null
        
        return element
      }
      
      return this
    }
    
  })

}).call(this);