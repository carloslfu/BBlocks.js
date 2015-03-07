// svg.resizable.js based on svg.draggable.js 0.1.0 by Wout Fierens
// Autor: Carlos Galarza (carloslfu@gmail.com)
;(function() {

  SVG.extend(SVG.Element, {
    // Make element resizable
    // Constraint might be a object (as described in readme.md) or a function in the form "function (x, y)" that gets called before every move.
    // The function can return a boolean or a object of the form {x, y}, to which the element will be moved. "False" skips moving, true moves to raw x, y.
    resizable: function(context, constraint, attachToEls) {
      var startResize, resize, endResize
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

        /* invoke any callbacks */
        if (element.beforeresize)
          element.beforeresize(event)
        
        /* get element bounding box */
        var box = element.bbox()
        
        if (element instanceof SVG.G) {
          box.x = element.x()
          box.y = element.y()
          
        } else if (element instanceof SVG.Nested) {
          box = {
            x:      element.x()
          , y:      element.y()
          , width:  element.width()
          , height: element.height()
          }
        }
        
        /* store event */
        element.startEventResize = event
        
        /* store start position */
        element.startPositionResize = {
          x:        box.x
        , y:        box.y
        , width:    box.width
        , height:   box.height
        , zoom:     context.workspace.absoluteScale
        , rotation: element.transform('rotation') * Math.PI / 180
        }
        
        /* add while and end events to window */
        window.addEventListener('pointermove', resize);
        window.addEventListener('pointerup', endResize);
        
        /* invoke any callbacks */
        if (element.resizestart)
          element.resizestart({ x: 0, y: 0, zoom: element.startPositionResize.zoom }, event)
        
        /* prevent selection resizing */
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        event.stopPropagation();
      }
      
      /* while resizing */
      resize = function(event) {
        event = event || window.event
        
        if (element.startEventResize) {
          /* calculate move position */
          var dx, dy
            , rotation  = element.startPositionResize.rotation
            , width     = element.startPositionResize.width
            , height    = element.startPositionResize.height
            , delta     = {
                x:    event.pageX - element.startEventResize.pageX,
                y:    event.pageY - element.startEventResize.pageY,
                zoom: element.startPositionResize.zoom
              }
          
          /* caculate new position [with rotation correction] */
          dx = (delta.x * Math.cos(rotation) + delta.y * Math.sin(rotation))  / element.startPositionResize.zoom;
          dy = (delta.y * Math.cos(rotation) + delta.x * Math.sin(-rotation)) / element.startPositionResize.zoom;
          
          /* move the element to its new position, if possible by constraint */
          if (typeof constraint === 'function') {
            var coord = constraint(x, y)

            if (typeof coord === 'object') {
              if (typeof coord.x != 'boolean' || coord.x)
                element.x(typeof coord.x === 'number' ? coord.x : x)
              if (typeof coord.y != 'boolean' || coord.y)
                element.y(typeof coord.y === 'number' ? coord.y : y)

            } else if (typeof coord === 'boolean' && coord) {
              context.resize(width + dx - 10, height + dy - 10) 
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

            context.resize(width + dx - 10, height + dy - 10)          
          }

          /* invoke any callbacks */
          if (element.resizemove)
            element.resizemove(delta, event)
        }
        event.stopPropagation();
      }
      
      /* when resizing ends */
      endResize = function(event) {
        event = event || window.event
        
        /* calculate move position */
        var delta = {
          x:    event.pageX - element.startEventResize.pageX
        , y:    event.pageY - element.startEventResize.pageY
        , zoom: element.startPositionResize.zoom
        }
        
        /* reset store */
        element.startEventResize    = null
        element.startPositionResize = null

        /* remove while and end events to window */
        window.removeEventListener('pointermove', resize);
        window.removeEventListener('pointerup', endResize);

        /* invoke any callbacks */
        if (element.resizeend)
          element.resizeend(delta, event)
        event.stopPropagation();
      }
      
      /* bind mousedown event */
      attachToEls.forEach(function(el) {
        el.node.addEventListener('pointerdown', startResize);
      });
      
      /* disable resizable */
      element.fixedResize = function() {
        attachToEls.forEach(function(el) {
          el.node.removeEventListener('pointerdown', startResize);
        });
        window.removeEventListener('pointermove', resize);
        window.removeEventListener('pointerup', endResize);
        
        startResize = resize = endResize = null
        
        return element
      }
      
      return this
    }
    
  })

}).call(this);