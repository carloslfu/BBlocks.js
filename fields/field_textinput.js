'use strict'

// Field text input
BB.FieldTextInput = BB.Field.prototype.create({
  // TODO: invert text color when are selected, note that is not trivial.
  constructor: function(text, parent, options)  {
    this.parentClass_.constructor.call(this, 'Text');
    this.children = [];
    this.container = null; // contains attached elements(border), this is a nested SVG document
    this.childContainer = null; // svg group that contains all children
    this.root = null;
    this.fontFamily = 'sans-serif';
    this.fontColor = '#000'; // Must be in hex format to get the negative or modify utils.js/color2negative function to allows other color formats
    // (Not yet implemented negative color for selection)
    this.selectionColor = '#3399FF';
    this.size = 15; // px default metrics in svg.js library
    this.width = 100;
    this.height = this.size + 3;
    // Intenals
    // TODO: a container must be a group for decoration, the root will be the text
    this.textMetrics = null;
    this.textWidth = 0;
    this.lastTextWidth = 0;
    this.initialSpaceX = 0;
    this.initialSpaceY = 0;
    this.finalSpaceX = 0;
    this.finalSpaceY = 0;
    this.offsetX = 0; // X scroll offset relative to the text (one line textInput doesn't need offsetY)
    this.initialCursorY = 1; // Vertical cursor initial separation relative to SVG element
    this.initialCursorX = 0; // Horizontal cursor initial separation relative to SVG element
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
      this.container.size(this.width, this.height);
      //Mirror root for cursor position, this contains 0 to cursorPosition text (metrics)
      this.mirrorRoot = this.container.text(this.text).font({
        family: this.fontFamily
        , size: this.fontSize}).fill(this.fontColor).move(0, 0) //BUG: svg.js bug when add text to a group
        .style('text-rendering: geometricPrecision');
      // Text metrics
      this.textMetrics = this.getTextMetrics();
      // Background hides mirrorRoot
      this.background = this.container.rect(this.width, this.height).move(0, 0).fill('#fff');
      this.selectionRoot =  this.container.rect(0, this.initialCursorY + this.size).move(0, 0).fill(this.selectionColor);
      this.root = this.container.text(this.text.replace(/ /g, '\u00a0')).font({
        family: this.fontFamily
        , size: this.fontSize}).fill(this.fontColor).move(this.initialSpaceX, this.initialSpaceY) //BUG: svg.js bug when add text to a group
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
        var keyId, refreshCursor = false;
        if (e.key) { // Firefox
          keyId = e.key;
        } else if (e.keyIdentifier) { // Chrome
          keyId = e.keyIdentifier;
        }
        if (keyId == 'Enter') {
          return; // Ignore some keys
        }
        if (e.which == 8 || e.which == 46 || keyId == 'Left' || keyId == 'Right'
            || keyId == 'Up' || keyId == 'Down' || keyId == 'Home' || keyId == 'End'
            // New keyboard API for firefox see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent.key
            || keyId == 'ArrowLeft' || keyId == 'ArrowRight' || keyId == 'ArrowUp' || keyId == 'ArrowDown'
           ) {
          // Special keys that changes the text: backspace, delete
          if (e.which == 8 || e.which == 46) {
            if (this_.text != e.target.value) {
              this_.text = e.target.value;
              this_.root.text(this_.text.replace(/ /g, '\u00a0')); // Shows spaces with the &nbsp html character
              this_.textMetrics = this_.getTextMetrics(); // Update text metrics
            }
          }
        } else { // normal keys
          caretPos++;
          this_.text = e.target.value;
          this_.root.text(this_.text.replace(/ /g, '\u00a0'));
          this_.textMetrics = this_.getTextMetrics(); // Update text metrics
        }
        // getCaretPosition function not used now
        var selectionStart = this_.foreignTextInput.getChild(0).selectionStart, mirrorText,
            selectionEnd = this_.foreignTextInput.getChild(0).selectionEnd, selectionWidth = 0, i,
            caretPos = selectionStart;
        // Computes the width of selectionRoot (the rect for selected text)
        for (i = selectionStart; i < selectionEnd; i++) {
          selectionWidth += this_.textMetrics[i];
        }
        if (selectionWidth == 0) {
          this_.showCursor();
        } else {
          this_.hideCursor();
        }
        // The text before the caret
        mirrorText = this_.text.substr(0, caretPos);
        this_.mirrorText = mirrorText;
        this_.mirrorRoot.text(mirrorText.replace(/ /g, '\u00a0'));
        var bbox = this_.mirrorRoot.bbox();
        if (this_.mirrorText == '') { // Avoids chromium bug see: https://code.google.com/p/chromium/issues/detail?id=474275
          bbox.width = 0;
        }
        // Scrolling logic
        if (keyId == 'Left' || keyId == 'Right'
            || keyId == 'Up' || keyId == 'Down' || keyId == 'Home' || keyId == 'End'
            // New keyboard API for firefox see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent.key
            || keyId == 'ArrowLeft' || keyId == 'ArrowRight' || keyId == 'ArrowUp' || keyId == 'ArrowDown'
           ) { // Modify text have a diferent behavior that only moves in it
          if (-this_.offsetX > bbox.width) {
            this_.offsetX = -bbox.width;
          }
        } else { // Logic for scrolling when modify text
          if (-this_.offsetX + this_.width >= this_.lastTextWidth && this_.width < this_.lastTextWidth) {
            this_.offsetX = (this_.width - this_.textWidth > 0) ? 0 : this_.width - this_.textWidth;
          }
        }
        if (this_.width - this_.offsetX <= bbox.width) {
          this_.offsetX = this_.width - bbox.width;
        }
        this_.cursor.move(this_.initialCursorX + this_.offsetX + bbox.width, this_.initialCursorY); // Position of cursor
        this_.root.x(this_.initialCursorX + this_.offsetX); // Scrolls the text
        this_.selectionRoot.move(this_.initialCursorX + this_.offsetX + bbox.width, this_.initialCursorY);
        this_.selectionRoot.width(selectionWidth);
      }
      this.foreignTextInput.getChild(0).addEventListener('keyup', KeyboardHandler);
      this.foreignTextInput.getChild(0).addEventListener('keydown', KeyboardHandler);

      // Pointerdown handler
      PolymerGestures.addEventListener(this.container.node, 'down', function (e) {
        // Keeps reference to viewport
        var lastviewportElement = e.target.viewportElement;
        var mousePos = mouseToSvg(e, this_.container.node), i, len, pos1 = 0, pos2 = 0;
        // Mouse position relative to scroll
        mousePos.x -= this_.initialCursorX + this_.initialSpaceX + this_.offsetX;
        // Find the caret position for this pointerdown event
        for (i = 0, len = this_.textMetrics.length; i <= len; i++) {
          pos1 = pos2;
          pos2 += ((i == 0) ? 0 : this_.textMetrics[i - 1]/2) + ((i == len) ? 0 : this_.textMetrics[i]/2);
          //console.log(pos1 + '<=' + mousePos.x + '<' + pos2) // DEBUGGING LINE
          if (pos1 <= mousePos.x && mousePos.x < pos2) {
            break;
          }
        }
        this_.selectionRoot.width(0);
        this_.mirrorText = this_.text.substr(0, i);
        this_.mirrorRoot.text(this_.mirrorText.replace(/ /g, '\u00a0'));
        setCaretPosition(this_.foreignTextInput.getChild(0), i);
        if (!this_.cursorInterval) {
          var blur = function (ev) {
            if (lastviewportElement != ev.target.viewportElement) { // An element in the same viewport can't deactivate the caret
              PolymerGestures.removeEventListener(window, 'down', blur);
              this_.foreignTextInput.getChild(0).blur();
              this_.selectionRoot.width(0); // Hides selectionRoot
              this_.hideCursor();
            }
            ev.preventDefault();
            ev.stopPropagation();
          };
          // Next down event blurs textinput
          PolymerGestures.addEventListener(window, 'down', blur);
        }
        this_.showCursor();
      });

      if (this.parent.attachDraggable) {
        this.parent.attachDraggable.push(this.container); // This text can drag all parent
      }
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
      this.cursorXY.x = this.initialCursorX + this.offsetX + bbox.width;
      this.cursorXY.y = this.initialCursorY;
    }
    var x = this.cursorXY.x, y = this.cursorXY.y;
    if (!this.cursor) {
      this.cursor = this.container.line(x, y, x, y + this.size + 1).stroke({ width: 1 });
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
      }, 530 ); // Interval in ms for the caret
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
    // Keeps last value
    this.lastTextWidth = this.textWidth;
    // Calc text metrics
    var textMetrics = [], bbox;
    for (var i = 1, len = this.text.length; i <= len; i++) {
      tempMirrorText = this.text.substr(0, i);
      this.mirrorRoot.text(tempMirrorText.replace(/ /g, '\u00a0')); // TODO: make a setText method that functionality
      bbox = this.mirrorRoot.bbox();
      textMetrics.push(bbox.width - lastWidth);
      lastWidth = bbox.width;
    }
    // Keeps lastWidth
    this.textWidth = lastWidth;
    // Restores mirrorRoot text
    this.mirrorRoot.text(this.text.replace(/ /g, '\u00a0'));
    return textMetrics;
  }

});
