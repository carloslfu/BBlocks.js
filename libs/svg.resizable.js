// svg.resizable.js based on svg.draggable.js 0.1.0 by Wout Fierens
// Autor: Carlos Galarza (carloslfu@gmail.com)
;(function() {

  SVG.extend(SVG.Element, {
    // Make element resizable
    // Constraint might be a object (as described in readme.md) or a function in the form "function (x, y)" that gets called before every move.
    // The function can return a boolean or a object of the form {x, y}, to which the element will be moved. "False" skips moving, true moves to raw x, y.
    resizable: function(constraint, attachToEls) {
      var startDrag, drag, endDrag
        , element = this
        , parent  = this._parent(SVG.Doc) || this.parent._parent(SVG.Nested);

      if (!attachToEls) {
        attachToEls = [element];
      }
      /* remove resizable if already present */
      if (typeof this.fixedDrag === 'function')
        this.fixedDrag();
      
      /* ensure constraint object */
      constraint = constraint || {}
      
      /* start dragging */
      startDrag = function(event) {
        event = event || window.event

        /* invoke any callbacks */
        if (element.beforedrag)
          element.beforedrag(event)
        
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
        element.startEventDrag = event
        
        /* store start position */
        element.startPositionDrag = {
          x:        box.x
        , y:        box.y
        , width:    box.width
        , height:   box.height
        , zoom:     parent.viewbox().zoom
        , rotation: element.transform('rotation') * Math.PI / 180
        }
        
        /* add while and end events to window */
        window.addEventListener('pointermove', drag);
        window.addEventListener('pointerup', endDrag);
        
        /* invoke any callbacks */
        if (element.dragstart)
          element.dragstart({ x: 0, y: 0, zoom: element.startPositionDrag.zoom }, event)
        
        /* prevent selection dragging */
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        event.stopPropagation();
      }
      
      /* while resizing */
      resize = function(event) {
        event = event || window.event
        
        if (element.startEventDrag) {
          /* calculate move position */
          var x, y
            , rotation  = element.startPositionDrag.rotation
            , width     = element.startPositionDrag.width
            , height    = element.startPositionDrag.height
            , delta     = {
                x:    event.pageX - element.startEventDrag.pageX,
                y:    event.pageY - element.startEventDrag.pageY,
                zoom: element.startPositionResize.zoom
              }
          
          /* caculate new position [with rotation correction] */
          x = element.startPositionDrag.x + (delta.x * Math.cos(rotation) + delta.y * Math.sin(rotation))  / element.startPositionDrag.zoom;
          y = element.startPositionDrag.y + (delta.y * Math.cos(rotation) + delta.x * Math.sin(-rotation)) / element.startPositionDrag.zoom;
          
          /* move the element to its new position, if possible by constraint */
          if (typeof constraint === 'function') {
            var coord = constraint(x, y)

            if (typeof coord === 'object') {
              if (typeof coord.x != 'boolean' || coord.x)
                element.x(typeof coord.x === 'number' ? coord.x : x)
              if (typeof coord.y != 'boolean' || coord.y)
                element.y(typeof coord.y === 'number' ? coord.y : y)

            } else if (typeof coord === 'boolean' && coord) {
              element.move(x, y)
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
          }

          /* invoke any callbacks */
          if (element.dragmove)
            element.dragmove(delta, event)
        }
        event.stopPropagation();
      }
      
      /* when dragging ends */
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
        if (element.dragend)
          element.dragend(delta, event)
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