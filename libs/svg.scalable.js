// svg.scalable.js based on svg.draggable.js 0.1.0 by Wout Fierens
// Autor: Carlos Galarza (carloslfu@gmail.com)
;(function() {

  SVG.extend(SVG.Element, {
    // Make element scalable
    // Constraint might be a object (as described in readme.md) or a function in the form "function (x, y)" that gets called before every move.
    // The function can return a boolean or a object of the form {x, y}, to which the element will be moved. "False" skips moving, true moves to raw x, y.
    scalable: function(context, constraint, attachToEls) {
      var startScale, scale, endScale, mouseWheelScale, mouseMoveTracking
        , element = this
        , parent  = this._parent(SVG.Doc) || this.parent._parent(SVG.Nested);

      if (!attachToEls) {
        attachToEls = [element];
      }
      /* remove scalable if already present */
      if (typeof this.fixedScale === 'function')
        this.fixedScale();
      
      /* ensure constraint object */
      constraint = constraint || {}

      mouseMoveTracking = function(e) {
        //mouse position tracking (for scaling)
        context.mousePosition = mouseToSvg(e, context.root.node);
      };
      /**
       * Handle a mouse-wheel on SVG background.
       * @param {!Event} e Mouse wheel event.
       * @private
       */
      mouseWheelScale = function(e) {
        // cross-browser wheel delta
        var e = window.event || e; // old IE support
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        var x = context.mousePosition.x;
        var y = context.mousePosition.y;
        context.zoom(x , y, delta);
        //console.log('mousewheel event in ' + context.name + ' by: ' + delta); //for debug
        e.preventDefault();
      }

      /* for implement scaling with pointergestures - TODO: implement gesture for zooming
      // start scaling
      startScale = function(event) {
        event = event || window.event

        // invoke any callbacks
        if (element.beforedrag)
          element.beforedrag(event)
        
        // get element bounding box
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
        
        // store event
        element.startEventScale = event
        
        // store start position
        element.startPositionScale = {
          x:        box.x
        , y:        box.y
        , width:    box.width
        , height:   box.height
        , zoom:     context.absoluteScale
        , rotation: element.transform('rotation') * Math.PI / 180
        }
        
        // add while and end events to window
        window.addEventListener('pointermove', scale);
        window.addEventListener('pointerup', endScale);
        
        // invoke any callbacks
        if (element.scalestart)
          element.scalestart({ x: 0, y: 0, zoom: element.startPositionScale.zoom }, event)
        
        // prevent selection scaling
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        event.stopPropagation();
      }
      
      // while scaling
      scale = function(event) {
        event = event || window.event
        
        if (element.startEventScale) {
          // calculate move position
          var x, y
            , rotation  = element.startPositionScale.rotation
            , width     = element.startPositionScale.width
            , height    = element.startPositionScale.height
            , delta     = {
                x:    event.pageX - element.startEventScale.pageX,
                y:    event.pageY - element.startEventScale.pageY,
                zoom: element.startPositionScale.zoom
              }
          
          // caculate new position [with rotation correction]
          x = element.startPositionScale.x + (delta.x * Math.cos(rotation) + delta.y * Math.sin(rotation))  / element.startPositionScale.zoom;
          y = element.startPositionScale.y + (delta.y * Math.cos(rotation) + delta.x * Math.sin(-rotation)) / element.startPositionScale.zoom;
          
          // move the element to its new position, if possible by constraint
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
            // keep element within constrained box
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

          // invoke any callbacks
          if (element.scalechange)
            element.scalechange(delta, event)
        }
        event.stopPropagation();
      }
      
      // when scaling ends
      endScale = function(event) {
        event = event || window.event
        
        // calculate move position
        var delta = {
          x:    event.pageX - element.startEventScale.pageX
        , y:    event.pageY - element.startEventScale.pageY
        , zoom: element.startPositionScale.zoom
        }
        
        // reset store
        element.startEventScale    = null
        element.startPositionScale = null

        // remove while and end events to window
        window.removeEventListener('pointermove', scale);
        window.removeEventListener('pointerup', endScale);

        // invoke any callbacks
        if (element.scaleend)
          element.scaleend(delta, event)
        event.stopPropagation();
      }
      */
      // bind mousedown event
      attachToEls.forEach(function(el) {
        el.node.addEventListener('mousemove', mouseMoveTracking); // other browsers
        el.node.addEventListener('DOMMouseScroll', mouseWheelScale); // firefox
        el.node.addEventListener('mousewheel', mouseWheelScale); // other browsers
      });
      
      // disable scalable
      element.fixedScale = function() {
        attachToEls.forEach(function(el) {
          el.node.removeEventListener('mousemove', mouseMoveTracking);
          el.node.removeEventListener('DOMMouseScroll', mouseWheelScale);
          el.node.removeEventListener('mousewheel', mouseWheelScale);
        });
        //window.removeEventListener('pointermove', scale);
        //window.removeEventListener('pointerup', endScale);
        
        startScale = scale = endScale = mouseWheelScale = mouseMoveTracking = null
        
        return element
      }
      
      return this
    }
    
  })

}).call(this);