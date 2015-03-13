function disableSelect(el){			
    if(el.addEventListener){
        el.addEventListener("pointerdown",disabler,"false");
    } else {
        el.attachEvent("onselectstart",disabler);
    }
}
 
function enableSelect(el){
    if(el.addEventListener){
	el.removeEventListener("pointerdown",disabler,"false");
    } else {
        el.detachEvent("onselectstart",disabler);
    }
}
 
function disabler(e){
    if(e.preventDefault){ e.preventDefault(); }
    return false;
}

//function imported from blockly core : utils.js
/**
 * Convert between HTML coordinates and SVG coordinates.
 * @param {number} x X input coordinate.
 * @param {number} y Y input coordinate.
 * @param {boolean} toSvg True to convert to SVG coordinates.
 *     False to convert to mouse/HTML coordinates.
 * @return {!Object} Object with x and y properties in output coordinates.
 */
function convertCoordinates(x, y, toSvg, node) {
  if (toSvg) {
    x -= window.scrollX || window.pageXOffset;
    y -= window.scrollY || window.pageYOffset;
  }
  var svgPoint = node.createSVGPoint();
  svgPoint.x = x;
  svgPoint.y = y;
  var matrix = node.getScreenCTM();
  if (toSvg) {
    matrix = matrix.inverse();
  }
  var xy = svgPoint.matrixTransform(matrix);
  if (!toSvg) {
    xy.x += window.scrollX || window.pageXOffset;
    xy.y += window.scrollY || window.pageYOffset;
  }
  return xy;
};

//function imported from blockly core : utils.js
/**
 * Return the converted coordinates of the given mouse event.
 * The origin (0,0) is the top-left corner of the Blockly svg.
 * @param {!Event} e Mouse event.
 * @return {!Object} Object with .x and .y properties.
 */
function mouseToSvg(e, node) {
  var scrollX = window.scrollX || window.pageXOffset;
  var scrollY = window.scrollY || window.pageYOffset;
  return convertCoordinates(e.clientX + scrollX,
                                    e.clientY + scrollY, true, node);
};

// Extend an existing object with a method from another - Mixin pattern
function mixin(receivingClass, givingClass) {
  //only provide certain methods
  if (arguments[2]) {
    for (var i = 2, len = arguments.length; i < len; i++) {
      receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
    }
  } else { //provide all methods
    for (var methodName in givingClass.prototype) {
      if (!Object.hasOwnProperty.call(receivingClass.prototype, methodName)) {
        receivingClass.prototype[methodName] = givingClass.prototype[methodName];
      }
    }
  }
};