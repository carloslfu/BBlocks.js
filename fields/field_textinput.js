'use strict'
// Future inspiration and ideas for implementation http://making.fiftythree.com/fluid-text-inputs/
// TODOs: 
//    - Implement granular character handlig (user pair evaluation) , this allows have more than 24 characters
//    - Implement option for expandable fluid text
// Field text input
BB.FieldTextInput = BB.Field.prototype.create({
  // TODO: invert text color when are selected, note that is not trivial.
  constructor: function(text, parent, options)  {
    this.parentClass_.constructor.call(this, 'Text');
    this.children = [];
    this.container = null; // contains attached elements(border)
    this.childContainer = null; // svg group that contains all children
    this.root = null; // contains the text, this is a nested SVG document (is a container an have it own viewport allowing 'overflow: hidden' css property)
    this.textRoot = null;
    this.fontFamily = 'sans-serif';
    this.fontColor = '#000'; // Must be in hex format to get the negative or modify utils.js/color2negative function to allows other color formats
    // (Not yet implemented negative color for selection, needs an individual tspan for selection and repositioning it beacuse some fonts overlaps letters)
    this.selectionColor = '#3399FF';
    this.backgroundColor = '#FFFFFF'; // background color when is focused
    this.backgroundColorBlured = '#BDC2DB'; // background color when is not focused
    this.size = 15; // px default metrics in svg.js library
    this.width = 100;
    this.height = this.size + 3;
    // Intenals
    this.style = {
      className: 'BBFieldTextInput'
    };
    this.textMetrics = null;
    this.textWidth = 0;
    this.lastTextWidth = 0;
    this.initialSpaceX = 1;
    this.initialSpaceY = 1;
    this.finalSpaceX = 1;
    this.finalSpaceY = 1;
    this.offsetX = 0; // X scroll offset relative to the text (one line textInput doesn't need offsetY)
    this.initialCursorY = 1; // Vertical cursor initial separation relative to SVG element
    this.initialCursorX = 0; // Horizontal cursor initial separation relative to SVG element
    this.cursor = null;
    this.cursorXY = {x: 0, y: 0};
    this.cursorState = 0; //0: off, 1: on
    this.cursorInterval = null;
    this.focused = false;
    this.draggableIndex = -1; // Index of this in attachDraggable array in the parent (if exists)

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
      this.container = this.parent.container.group().addClass(this.style.className);
      this.mainBackground = this.container
        .rect(this.width + this.initialSpaceX + this.finalSpaceX, this.height + this.initialSpaceY + this.finalSpaceY)
        .move(0, 0).fill(this.backgroundColorBlured).radius(4);
      // Nested svg as a root allows use overflow css property
      this.root = this.container.nested()
        .attr('style', 'overflow: hidden;');
      this.root.size(this.width, this.height).move(this.initialSpaceX, this.initialSpaceY);
      //Mirror root for cursor position, this contains 0 to cursorPosition text (metrics)
      this.mirrorRoot = this.root.text(this.text).font({
        family: this.fontFamily
        , size: this.fontSize}).fill(this.fontColor).move(0, 0) //BUG: svg.js bug when add text to a group
        .style('text-rendering: geometricPrecision');
      // Background hides mirrorRoot
      this.background = this.root.rect(this.width, this.height).move(0, 0).fill(this.backgroundColorBlured);
      this.selectionRoot =  this.root.rect(0, this.initialCursorY + this.size).move(0, 0).fill(this.selectionColor);
      this.textRoot = this.root.text(this.text.replace(/ /g, '\u00a0')).font({
        family: this.fontFamily
        , size: this.fontSize}).fill(this.fontColor).move(0, 0) //BUG: svg.js bug when add text to a group
        .style('text-rendering: geometricPrecision'); // when scales keeps proportions
      // Text metrics
      this.getTextMetrics();
      // Creates a foreign text input for listening keyboard events,
      // this isn't necesary when implemented editable svg text element from SVG 1.2 tiny specification
      // avoid some webkit and blink bugs with textinputs when are rotated and scaled.
      this.foreignTextInput = this.container.foreignObject(0,0).attr({id: 'fobj'})
        .appendChild("input", {type: 'text', value: this.text});
      this.setMaxChars(24); // Android bug when have 25 characters - REPORT this (OMG report all svg foreign object implementation! o.O)
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
              this_.textRoot.text(this_.text.replace(/ /g, '\u00a0')); // Shows spaces with the &nbsp html character
              this_.getTextMetrics(); // Update text metrics
            }
          }
        } else { // normal keys
          if (this_.text != e.target.value) {
            this_.text = e.target.value;
            this_.textRoot.text(this_.text.replace(/ /g, '\u00a0'));
            this_.getTextMetrics(-1, this_.foreignTextInput.getChild(0).selectionStart); // Update text metrics
          }
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
        this_.textRoot.x(this_.initialCursorX + this_.offsetX); // Scrolls the text
        // Moves and resize selectionRoot
        this_.selectionRoot.move(this_.initialCursorX + this_.offsetX + bbox.width, this_.initialCursorY);
        this_.selectionRoot.width(selectionWidth);
      }
      this.foreignTextInput.getChild(0).addEventListener('keyup', KeyboardHandler);
      this.foreignTextInput.getChild(0).addEventListener('keydown', KeyboardHandler);

      // Flag for trackstart
      this.trackStarted = false;
      // Sets caret position with pointer
      this.pointerCaretHandler = function (e) {
        if (this_.trackStarted == false) {
          // Keeps reference to viewport
          var lastviewportElement = e.target.viewportElement;
          var mousePos = mouseToSvg(e, this_.root.node), i, len, pos1 = 0, pos2 = 0;
          // Mouse position relative to scroll
          mousePos.x -= this_.initialCursorX + this_.offsetX;
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
          if (e.type == 'up' || this_.focused == true) {
            if (!this_.cursorInterval) {
              var blur = function (ev) {
                if (lastviewportElement != ev.target.viewportElement) { // An element in the same viewport can't deactivate the caret
                  PolymerGestures.removeEventListener(window, 'down', blur);
                  this_.foreignTextInput.getChild(0).blur();
                  this_.selectionRoot.width(0); // Hides selectionRoot
                  this_.hideCursor();
                  this_.setFocused(false);
                }
                ev.preventDefault();
                ev.stopPropagation();
              };
              // Next down event blurs textinput
              PolymerGestures.addEventListener(window, 'down', blur);
            }
            this_.showCursor();
            this_.setFocused(true);
          }
        } else {
          this_.trackStarted = false;
        }
      };
      PolymerGestures.addEventListener(this.root.node, 'up', this.pointerCaretHandler);
      PolymerGestures.addEventListener(this.root.node, 'trackstart', this.pointerCaretHandler);
      
      //Pointertrackstart handler
      PolymerGestures.addEventListener(this.root.node, 'trackstart', function (e) {
        //console.log('trackstart')
        this_.trackStarted = true;
        this_.referenceCursorSelection = this_.foreignTextInput.getChild(0).selectionStart;
        this_.referenceOffsetX = this_.offsetX;
      });
      // Selects text with pointer
      this.pointerCaretSelectionHandler = function (e) {
        // console.log('track')
        // Keeps reference to viewport
        var mousePos = mouseToSvg(e, this_.root.node), i, len, pos1 = 0, pos2 = 0;
        // Mouse position relative to scroll
        mousePos.x -= this_.initialCursorX + this_.offsetX;
        // Find the caret position for this pointerdown event
        if (mousePos.x < 0) {
          i = 0;
        } else { 
          for (i = 0, len = this_.textMetrics.length; i <= len; i++) {
            pos1 = pos2;
            pos2 += ((i == 0) ? 0 : this_.textMetrics[i - 1]/2) + ((i == len) ? 0 : this_.textMetrics[i]/2);
            //console.log(pos1 + '<=' + mousePos.x + '<' + pos2) // DEBUGGING LINE
            if (pos1 <= mousePos.x && mousePos.x < pos2) {
              break;
            }
          }
        }
        var reverseSelection = false;
        // Diferential of offset relative to trackstart event
        var doffsetX = this_.offsetX - this_.referenceOffsetX;
        if (e.dx >= doffsetX) {
          this_.foreignTextInput.getChild(0).selectionStart = this_.referenceCursorSelection;
          this_.foreignTextInput.getChild(0).selectionEnd = i;
        } else {
          this_.foreignTextInput.getChild(0).selectionStart = i;
          this_.foreignTextInput.getChild(0).selectionEnd = this_.referenceCursorSelection;
          reverseSelection = true;
        }
        /*console.log(i)
        console.log('d:'+this_.foreignTextInput.getChild(0).selectionEnd);
        console.log('d:'+this_.foreignTextInput.getChild(0).selectionStart);*/ // DEBUGGING lines
        var selectionStart = this_.foreignTextInput.getChild(0).selectionStart,
            mirrorText, selectionEnd = this_.foreignTextInput.getChild(0).selectionEnd, selectionWidth = 0;
        // Computes the width of selectionRoot (the rect for selected text)
        for (i = selectionStart; i < selectionEnd; i++) {
          selectionWidth += this_.textMetrics[i];
        }
        if (selectionWidth == 0) {
          this_.showCursor();
        } else {
          this_.hideCursor();
        }
        //console.log('up:' + selectionWidth);
        var bbox = this_.mirrorRoot.bbox();
        if (this_.mirrorText == '') { // Avoids chromium bug see: https://code.google.com/p/chromium/issues/detail?id=474275
          bbox.width = 0;
        }
        // Scrolling logic
        var selectionDx = (reverseSelection?-1:1)*selectionWidth;
        if (-this_.offsetX > bbox.width + selectionDx) {
          this_.offsetX = -bbox.width - selectionDx;
        }
        if (this_.width - this_.offsetX <= bbox.width + selectionDx) {
          this_.offsetX = this_.width - bbox.width - selectionDx;
        }
        this_.textRoot.x(this_.initialCursorX + this_.offsetX); // Scrolls the text
        // Moves and resize selectionRoot
        this_.selectionRoot.move(this_.initialCursorX + this_.offsetX + bbox.width - (reverseSelection?selectionWidth:0), this_.initialCursorY);
        this_.selectionRoot.width(selectionWidth);
        this_.setFocused(true);
      };
      if (this.parent.attachDraggable) {
        this.parent.attachDraggable.push(this.container); // This text can drag all parent
        this.draggableIndex = this.parent.attachDraggable.length - 1;
      }
      this.rendered = true;
    }
  
  },

  showCursor: function (pos) {
    if (pos) {
      this.cursorXY = pos;
    } else {
      var bbox = this.mirrorRoot.node.getBBox();
      if (this.mirrorText == '') {
        bbox.width = 0;
      }
      this.cursorXY.x = this.initialCursorX + this.offsetX + bbox.width;
      this.cursorXY.y = this.initialCursorY;
    }
    var x = this.cursorXY.x, y = this.cursorXY.y;
    if (!this.cursor) {
      this.cursor = this.root.line(x, y, x, y + this.size + 1).stroke({ width: 1 });
    } else { // If cursor exists moves it
      this.cursor.move(x, y);
    }
    this.hideCursor(); // resets the interval, for responsiveness
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

  // TODO: optimizes this for performance, diff text, only recalc the necesary text
  // keydiff is the key where are changed, this is optional but improves performance
  // if keydiff are defined position is not optional
  // -1 is a normal key that adds text
  // 8 and 46 are backspace and supr keys
  getTextMetrics: function (keydiff, position) {
    var tempMirrorText = this.text, lastWidth = 0;
    // Keeps last value
    this.lastTextWidth = this.textWidth;
    // Calc text metrics
    var textMetrics, bbox, bbox2, bbox3, dx1, dx2;
    if (keydiff == undefined || this.textMetrics == null) { // Calcs metrics of a whole text
      textMetrics = [];
      for (var i = 1, len = this.text.length; i <= len; i++) {
        tempMirrorText = this.text.substr(0, i);
        this.mirrorRoot.text(tempMirrorText.replace(/ /g, '\u00a0')); // TODO: make a setText method that functionality
        bbox = this.mirrorRoot.bbox();
        textMetrics.push(bbox.width - lastWidth);
        lastWidth = bbox.width;
      }
    } else {
      if (position == undefined) {
        throw 'If keydiff are defined position is not optional';
      }
      if (keydiff == -1 && this.text != this.lastText) {
        textMetrics = this.textMetrics;
        tempMirrorText = this.text.substr(0, position - 1);
        this.mirrorRoot.text(tempMirrorText.replace(/ /g, '\u00a0')); // TODO: make a setText method that functionality
        bbox = this.mirrorRoot.node.getBBox();
        if (tempMirrorText.length == 0) { // BUG: chrome, reported before in this code
          bbox.width = 0;
        }
        tempMirrorText = this.text.substr(0, position);
        this.mirrorRoot.text(tempMirrorText.replace(/ /g, '\u00a0')); // TODO: make a setText method that functionality
        bbox2 = this.mirrorRoot.node.getBBox();
        dx1 = bbox2.width - bbox.width;
        tempMirrorText = this.text.substr(0, position + 1);
        this.mirrorRoot.text(tempMirrorText.replace(/ /g, '\u00a0')); // TODO: make a setText method that functionality
        bbox3 = this.mirrorRoot.node.getBBox();
        dx2 = bbox3.width - bbox2.width;
        textMetrics =  textMetrics.slice(0, position - 1).concat([dx1].concat(textMetrics.slice(position)));
        if (dx2 != 0) {
          textMetrics =  textMetrics.slice(0, position).concat([dx2].concat(textMetrics.slice(position)));
        }
        //console.log(textMetrics.length + ' : ' + this.text.length)
      }
    }
    // Keeps lastWidth
    this.textWidth =  this.textRoot.node.getBBox().width;
    // Keeps lastText
    this.lastText = this.text;
    // Restores mirrorRoot text
    this.mirrorRoot.text(this.text.replace(/ /g, '\u00a0'));
    if (textMetrics != undefined) {
      this.textMetrics = textMetrics;
    }
  },
  
  // All logig when focused
  setFocused: function (bool) {
    if (this.focused != bool) {
      if (bool) {
        this.background.fill(this.backgroundColor);
        this.mainBackground.fill(this.backgroundColor);
        this.container.removeClass('BBFieldTextInput');
        PolymerGestures.addEventListener(this.root.node, 'track', this.pointerCaretSelectionHandler);
        if (this.parent.attachDraggable) {
          // if is focused not drag the parent
          this.parent.attachDraggable = this.parent.attachDraggable.slice(0, this.draggableIndex)
            .concat(this.parent.attachDraggable.slice(this.draggableIndex + 1));
          this.draggableIndex = -1;
        }
      } else {
        this.background.fill(this.backgroundColorBlured);
        this.mainBackground.fill(this.backgroundColorBlured);
        this.container.addClass('BBFieldTextInput');
        PolymerGestures.removeEventListener(this.root.node, 'track', this.pointerCaretSelectionHandler);
        // if is not focused drag the parent
        if (this.parent.attachDraggable) {
          this.parent.attachDraggable.push(this.container); // This text can drag all parent
          this.draggableIndex = this.parent.attachDraggable.length - 1;
        }
      }
      // Updates parent draggable handler
      if (this.parent.attachDraggable) {
        this.parent.updateDraggable();
      }
      this.focused = bool;
    }
  },

  // set the max number of chars in the field
  setMaxChars: function(num){
    if (num != undefined) {
      this.maxChars_ = num;
      this.foreignTextInput.getChild(0).maxLength = num;
    } else {
      throw 'Num is not optional';
    }
  },

  // get viewbox, override parent class method
  bbox: function(type){
    if (this.rendered) {
      var bbox = this.root.viewbox();
      bbox.width += this.initialSpaceX + this.finalSpaceX;
      bbox.height += this.initialSpaceY + this.finalSpaceY;
      return bbox;
    } else {
      throw 'Only rendered fields have a container';
    }
  }

});
