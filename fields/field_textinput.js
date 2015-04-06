'use strict'

// Field text input
BB.FieldTextInput = BB.Field.prototype.create({
  constructor: function(text, parent, options)  {
    this.parentClass_.constructor.call(this, 'Text');
    this.children = [];
    this.container = null; // contains attached elements(border) and SVG document
    this.childContainer = null; // svg group that contains all children
    this.root = null;
    this.fontFamily = 'sans-serif';
    this.fontColor = '#000';
    this.size = 15; // px default metrics in svg.js library
    this.width = 18;
    this.height = 100;
    this.cursor = null;
    this.cursorXY = {x: 0, y: 0};
    this.cursorState = 0; //0: off, 1: on
    this.cursorInterval = null;
    if (text && typeof(text) == 'string') {
      this.text = text;
    } else {
      throw 'Text must be a valid string';
      return;
    }
    if (parent) {
      this.parent = parent;
    }
    if (!options) {
      return;
    }
    if (options.fontColor) {
      this.fontColor = options.fontColor;
    }
    if (options.fontFamily) {
      this.fontFamily = options.fontFamily;
    }
    if (options.fontSize) {
      this.fontSize = options.fontSize;
    }
    if (options.width) {
      this.width = options.width;
    }
    if (options.height) {
      this.height = options.height;
    }
    if (options.render) {
      this.render();
    }
  },

  render: function(){
    if (!this.parent) {
      throw 'FieldTextInput must have a parent to be rendered';
      return;
    }
    if (!this.rendered) {
      // Nested svg as a container allows use overflow css property
      this.container = this.parent.container.nested()
        .attr('style', 'overflow: hidden;');
      this.container.size(this.height, this.width);
      this.background = this.container.rect(this.height, this.width).move(0, 0).fill('#fff');
      this.root = this.container.text(this.text).font({
        family: this.fontFamily
        , size: this.fontSize}).fill(this.fontColor).move(0, 0) //BUG: svg.js bug when add text to a group
        .style('text-rendering: geometricPrecision'); // when scales keeps proportions
      // Creates a text input for listening keyboard events, this isn't necesary when implemented editable svg text element from SVG 1.2 tiny specification
      // avoid some webkit and blink bugs with textinputs when are rotated and scaled.
      this.foreignTextInput = this.container.foreignObject(0,0).attr({id: 'fobj'})
        .appendChild("textarea", {value: this.text});
      // Keyboard handler
      var this_ = this;
      var KeyboardHandler = function (e) {
        console.log(e.which);
        if (this_.text != e.target.value) {
          this_.text = e.target.value;
          this_.root.text(this_.text);
        }
        
      }
      this.foreignTextInput.getChild(0).addEventListener('keyup', KeyboardHandler);
      this.foreignTextInput.getChild(0).addEventListener('keydown', KeyboardHandler);
      // Pointerdown handler
      PolymerGestures.addEventListener(this.container.node, 'down', function (e) {
        if (!this_.cursorInterval) {
          this_.foreignTextInput.getChild(0).focus();
          this_.showCursor();
          var blur = function (ev) {
            if (e.target != ev.target) { // The element can't deactivate itself
              PolymerGestures.removeEventListener(window, 'down', blur);
              this_.foreignTextInput.getChild(0).blur();
              this_.hideCursor();
            }
          };
          // Next down event blurs textinput
          PolymerGestures.addEventListener(window, 'down', blur);
        }
      });
    }
    if (this.parent.attachDraggable) {
      this.parent.attachDraggable.push(this.container); // This text can drag all parent
    }
  },

  showCursor: function (pos) {
    if (pos) {
      this.cursorXY = pos;
    } else {
      this.cursorXY.x = 0;
      this.cursorXY.y = 0;
    }
    var x = this.cursorXY.x, y = this.cursorXY.y;
    if (!this.cursor) {
      this.cursor = this.container.line(10, 1, 10, 17).stroke({ width: 1 });
    }
    if (!this.cursorInterval) {
      this.cursor.stroke({opacity: 1});
      this.cursorState = 1;
      var this_ = this;
      this.cursorInterval = setInterval(function () {
        if(this_.cursorState == 0) {
          this_.cursor.stroke({opacity: 1});
          this_.cursorState = 1;
        } else {
          this_.cursor.stroke({opacity: 0});
          this_.cursorState = 0;
        }
      }, 530 );
    }
  },

  hideCursor: function () {
    if (this.cursor) {
      this.cursor.stroke({opacity: 0});
      clearInterval(this.cursorInterval);
      this.cursorInterval = null;
    }
  }

});
