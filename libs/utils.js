'use strict'

// Obj.js library for dinamic created classes

// Class for self created objects, ObjJS is level 0 class
var ObjJS = function() {
  this.parentClass_ = Object.create(null);
};

ObjJS.prototype.create = function(classPrototype) {
  if (!classPrototype) {
    throw 'Must have a block protoype as argument'; 
    return;
  }
  if (!classPrototype.constructor) {
    classPrototype.constructor = function(){};
  }
  // create a class of self class
  var createdClass = function(){
    classPrototype.constructor.apply(this, arguments);
    delete this.create; // for cleaner tree
  };
  //createdClass.prototype = Object.create(this);
  createdClass.prototype = ObjJS.cloneObject(this);
  // extend createdClass with classPrototype
  ObjJS.mixin(createdClass, classPrototype, 'true');
  createdClass.prototype.create = ObjJS.prototype.create;
  createdClass.prototype.parentClass_ = this;
  return createdClass;
};

//Clone function extracted from closure library - base.js with some modifications
/**
 * Clones a value. The input may be an Object, Array, or basic type. Objects and
 * arrays will be cloned recursively.
 *
 * WARNINGS:
 * <code>goog.cloneObject</code> does not detect reference loops. Objects that
 * refer to themselves will cause infinite recursion.
 *
 * <code>goog.cloneObject</code> is unaware of unique identifiers, and copies
 * UIDs created by <code>getUid</code> into cloned results.
 *
 * @param {*} obj The value to clone.
 * @return {*} A clone of the input value.
 * @deprecated goog.cloneObject is unsafe. Prefer the goog.object methods.
 */
ObjJS.cloneObject = function(obj) {
  var type = typeof(obj);
  if (obj == null) { // Null is an object in ES5, avoids all the function
    return null;
  }
  if (type == 'object' || type == 'array') {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == 'array' ? [] : {};
    for (var key in obj) {
      clone[key] = ObjJS.cloneObject(obj[key]);
    }
    return clone;
  }

  return obj;
};

// Extend an existing class with a methods from an object - Mixin pattern
ObjJS.mixin = function(receivingClass, givingMixin, override) {
  if (override == undefined) {
    override = false; // 'true' overrides elements
  }
  //only provide certain methods
  if (arguments[3]) {
    for (var i = 3, len = arguments.length; i < len; i++) {
      if (!Object.hasOwnProperty.call(receivingClass.prototype, arguments[i])
          || override) {
        receivingClass.prototype[arguments[i]] = ObjJS.cloneObject(givingMixin[arguments[i]]);
      }
    }
  } else { //provide all methods
    for (var methodName in givingMixin) {
      if (!Object.hasOwnProperty.call(receivingClass.prototype, methodName)
          || override) {
        receivingClass.prototype[methodName] = ObjJS.cloneObject(givingMixin[methodName]);
      }
    }
  }
};

// Extend an existing class with a methods from an object - Mixin pattern
ObjJS.mixinObj = function(receivingObj, givingMixin, override) {
  if (override == undefined) {
    override = false; // 'true' overrides elements
  }
  //only provide certain methods
  if (arguments[3]) {
    for (var i = 3, len = arguments.length; i < len; i++) {
      if (!Object.hasOwnProperty.call(receivingObj, arguments[i])
          || override) {
        receivingObj[arguments[i]] = ObjJS.cloneObject(givingMixin[arguments[i]]);
      }
    }
  } else { //provide all methods
    for (var methodName in givingMixin) {
      if (!Object.hasOwnProperty.call(receivingObj, methodName)
          || override) {
        receivingObj[methodName] = ObjJS.cloneObject(givingMixin[methodName]);
      }
    }
  }
};


// reserved for future use
/*
ObjJS.countElements = function(obj) {
  var i=0;
  for(el in obj){
    i++;
  }
  return i;
};
// Extend an existing class with a methods from another - Mixin pattern
ObjJS.mixinClasses = function(receivingClass, givingClass, override) {
  if (override == undefined) {
    override = false; // 'true' overrides elements
  }
  //only provide certain methods
  if (arguments[3]) {
    for (var i = 3, len = arguments.length; i < len; i++) {
      if (!Object.hasOwnProperty.call(receivingClass.prototype, arguments[i])
          || override) {
        receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
      }
    }
  } else { //provide all methods
    for (var methodName in givingClass.prototype) {
      if (!Object.hasOwnProperty.call(receivingClass.prototype, methodName)
          || override) {
        receivingClass.prototype[methodName] = givingClass.prototype[methodName];
      }
    }
  }
};
*/
// ------------- end of Obj.js library
/*
// useful functions 
// --- for svg coordenates

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

// --- for textInput

function setCaretPosition(el, position) {
  el.selectionStart = position;
  el.selectionEnd = position;
  el.focus();
};

// getCaretPosition function not used now
/*
** Returns the caret (cursor) position of the specified text field.
** Return value range is 0-oField.value.length.
*/
/*
function getCaretPosition (oField) {

  // Initialize
  var iCaretPos = 0;

  // IE Support
  if (document.selection) {

    // Set focus on the element
    oField.focus ();

    // To get cursor position, get empty selection range
    var oSel = document.selection.createRange ();

    // Move selection start to 0 position
    oSel.moveStart ('character', -oField.value.length);

    // The caret position is selection length
    iCaretPos = oSel.text.length;
  }

  // Firefox support
  else if (oField.selectionStart || oField.selectionStart == '0')
    iCaretPos = oField.selectionStart;

  // Return results
  return (iCaretPos);
};
*/

function color2negative(hex) {
    // Validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, "");
    if (hex.length < 6) {
        hex = hex.replace(/(.)/g, '$1$1');
    }
    // Convert to decimal and converts to negative
    var rgb = "#",
        c;
    for (var i = 0; i < 3; ++i) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = (255 - c).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
};


// reserved for future use
/*
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
*/
