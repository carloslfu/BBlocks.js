// svg.scalable.js based on svg.draggable.js 0.1.0 by Wout Fierens
// Autor: Carlos Galarza (carloslfu@gmail.com)
;(function() {

  SVG.extend(SVG.Element, {
    // Make element scalable
    // Constraint might be a object (as described in readme.md) or a function in the form "function (x, y)" that gets called before every move.
    // The function can return a boolean or a object of the form {x, y}, to which the element will be moved. "False" skips moving, true moves to raw x, y.
    scalable: function(context, constraint, attachToEls) {
      var mouseWheelScale, mouseMoveTracking, pinch, pinchEnd
        , element = this, constraint
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
        if (context.scalestart)
          context.scalestart(x , y, delta)
        context.zoom(x , y, delta);
        e.preventDefault();
      };
      
      pinchStart = function(e){
        if (context.scalestart)
          context.scalestart(e)
        element.pinchdScale = element.pinchScale;
        element.pinchScale = e.scale;
        var evtPos = {clientX :e.centerX, clientY: e.centerY};
        element.pinchCenter = mouseToSvg(evtPos, context.root.node);
        e.preventDefault();
      };
      pinch = function(e){
        element.pinchdScale = e.scale/element.pinchScale;
        element.pinchScale = e.scale;
        context.zoom(element.pinchCenter.x, element.pinchCenter.y , null, element.pinchdScale);
        e.preventDefault();
        //console.log('pinch event in ' + context.name + ', scale: ' + e.scale);
      };
      
      pinchEnd = function(e){
        dScale = 1;
        element.pinchScale = null;
        e.preventDefault();
      };

      // bind mousedown event
      attachToEls.forEach(function(el) {
        // mousewheel
        el.node.addEventListener('mousemove', mouseMoveTracking); // other browsers
        el.node.addEventListener('DOMMouseScroll', mouseWheelScale); // firefox
        el.node.addEventListener('mousewheel', mouseWheelScale); // other browsers
        // pinch gesture
        PolymerGestures.addEventListener(el.node, 'pinchstart', pinchStart);
        PolymerGestures.addEventListener(el.node, 'pinch', pinch);
        PolymerGestures.addEventListener(el.node, 'pinchend', pinchEnd);
      });
      
      // disable scalable
      element.fixedScale = function() {
        attachToEls.forEach(function(el) {
          el.node.removeEventListener('mousemove', mouseMoveTracking);
          el.node.removeEventListener('DOMMouseScroll', mouseWheelScale);
          el.node.removeEventListener('mousewheel', mouseWheelScale);
          // pinch gesture
          PolymerGestures.removeEventListener(el.node, 'pinchstart', pinchStart);
          PolymerGestures.removeEventListener(el.node, 'pinch', pinch);
          PolymerGestures.removeEventListener(el.node, 'pinchend', pinchEnd);
        });
        
        pinch = pinchEnd = mouseWheelScale = mouseMoveTracking = null

        return element
      }
      
      return this
    }
    
  })

}).call(this);