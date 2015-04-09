'use strict'

// Field text input
BB.FieldTextInput = BB.Field.prototype.create({
  constructor: function(text, parent, options)  {
    this.parentClass_.constructor.call(this, 'Text');
    this.children = [];
    this.container = null; // contains attached elements(border), this is a nested SVG document
    this.childContainer = null; // svg group that contains all children
    this.root = null;
    this.fontFamily = 'sans-serif';
    this.fontColor = '#000';
    this.size = 15; // px default metrics in svg.js library
    this.width = 18;
    this.height = 100;
    // Intenals
    this.textMetrics = null;
    this.cursorOffsetY = 1; // Y cursor offset relative to the text
    this.cursor = null;
    this.cursorXY = {x: 0, y: 0};
    this.cursorState = 0; //0: off, 1: on
    this.cursorInterval = null;
    if (text && typeof(text) == 'string') {
      this.text = text;
      this.mirrorText = text;
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
      //Mirror root for cursor position, this contains 0 to cursorPosition text (metrics)
      this.mirrorRoot = this.container.text(this.text).font({
        family: this.fontFamily
        , size: this.fontSize}).fill(this.fontColor).move(0, 0) //BUG: svg.js bug when add text to a group
        .style('text-rendering: geometricPrecision');
      // Text metrics
      this.textMetrics = this.getTextMetrics();
      // Background hides mirrorRoot
      this.background = this.container.rect(this.height, this.width).move(0, 0).fill('#fff');
      this.root = this.container.text(this.text.replace(/ /g, '\u00a0')).font({
        family: this.fontFamily
        , size: this.fontSize}).fill(this.fontColor).move(0, 0) //BUG: svg.js bug when add text to a group
        .style('text-rendering: geometricPrecision'); // when scales keeps proportions
      // Creates a foreign text input for listening keyboard events,
      // this isn't necesary when implemented editable svg text element from SVG 1.2 tiny specification
      // avoid some webkit and blink bugs with textinputs when are rotated and scaled.
      this.foreignTextInput = this.container.foreignObject(0,0).attr({id: 'fobj'})
        .appendChild("input", {type: 'text', value: this.text});

      var this_ = this;

      // Keyboard handler
      var KeyboardHandler = function (e) { // Note that this handles keyup and keydown events
        // compatibility with Chrome and firefox
        var keyId;
        if (e.key) { // Firefox
          keyId = e.key;
        } else if (e.keyIdentifier) { // Chrome
          keyId = e.keyIdentifier;
        }
        if (e.which == 8 || e.which == 46 || keyId == 'Left' || keyId == 'Right'
            || keyId == 'Up' || keyId == 'Down' || keyId == 'Home' || keyId == 'End'
            // New keyboard API for firfox see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent.key
            || keyId == 'ArrowLeft' || keyId == 'ArrowRight' || keyId == 'ArrowUp' || keyId == 'ArrowDown'
           ) {
          // Special keys that changes the text: backspace, delete
          if (e.which == 8 || e.which == 46) {
            if (this_.text != e.target.value) {
              this_.text = e.target.value;
              this_.root.text(this_.text.replace(/ /g, '\u00a0'));
            }
          }
        } else { // normal keys
          caretPos++;
          this_.text = e.target.value;
          this_.root.text(this_.text.replace(/ /g, '\u00a0'));
          this_.textMetrics = this_.getTextMetrics(); // Update text metrics
        }
        var caretPos = getCaretPosition(e.target), mirrorText;
        mirrorText = this_.text.substr(0, caretPos);
        if (this_.mirrorText != mirrorText) { // The text before the caret
          this_.mirrorText = mirrorText;
          this_.mirrorRoot.text(mirrorText.replace(/ /g, '\u00a0'));
          var bbox = this_.mirrorRoot.bbox();
          if (this_.mirrorText == '') { // Avoids chromium bug see: https://code.google.com/p/chromium/issues/detail?id=474275
            bbox.width = 0;
          }
          this_.cursor.move(bbox.width, this_.cursorOffsetY);
        }
      }
      this.foreignTextInput.getChild(0).addEventListener('keyup', KeyboardHandler);
      this.foreignTextInput.getChild(0).addEventListener('keydown', KeyboardHandler);

      // Pointerdown handler
      PolymerGestures.addEventListener(this.container.node, 'down', function (e) {
        var mousePos = mouseToSvg(e, this_.container.node), i, len, pos1 = 0, pos2 = 0;
        // Find the caret position for this pointerdown event
        for (i = 0, len = this_.textMetrics.length; i <= len; i++) {
          pos1 = pos2;
          pos2 += ((i == 0) ? 0 : this_.textMetrics[i - 1]/2) + ((i == len) ? 0 : this_.textMetrics[i]/2);
          console.log(pos1 + '<=' + mousePos.x + '<' + pos2)
          if (pos1 <= mousePos.x && mousePos.x < pos2) {
            break;
          }
        }
        //if ()
        this_.mirrorText = this_.text.substr(0, i);
        this_.mirrorRoot.text(this_.mirrorText.replace(/ /g, '\u00a0'));
        setCaretPosition(this_.foreignTextInput.getChild(0), i);
        if (!this_.cursorInterval) {
          var blur = function (ev) {
            if (e.target.viewportElement != ev.target.viewportElement) { // An element in the same viewport can't deactivate the caret
              PolymerGestures.removeEventListener(window, 'down', blur);
              this_.foreignTextInput.getChild(0).blur();
              this_.hideCursor();
            }
          };
          // Next down event blurs textinput
          PolymerGestures.addEventListener(window, 'down', blur);
        }
        this_.showCursor();
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
      var bbox = this.mirrorRoot.bbox();
      if (this.mirrorText == '') {
        bbox.width = 0;
      }
      this.cursorXY.x = bbox.width;
      this.cursorXY.y = this.cursorOffsetY;
    }
    var x = this.cursorXY.x, y = this.cursorXY.y;
    if (!this.cursor) {
      this.cursor = this.container.line(x, y, x, y + 16).stroke({ width: 1 });
    } else { // If cursor exists moves it
      this.cursor.move(x, y);
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
  },

  getTextMetrics: function () {
    var tempMirrorText = this.text, lastWidth = 0;
    // Calc text metrics
    var textMetrics = [], bbox;
    for (var i = 1, len = this.text.length; i <= len; i++) {
      tempMirrorText = this.text.substr(0, i);
      this.mirrorRoot.text(tempMirrorText.replace(/ /g, '\u00a0')); // TODO: make a setText method that functionality
      bbox = this.mirrorRoot.bbox();
      textMetrics.push(bbox.width - lastWidth);
      lastWidth = bbox.width;
    }
    // Restores mirrorRoot text
    this.mirrorRoot.text(this.text.replace(/ /g, '\u00a0'));
    return textMetrics;
  }

});
