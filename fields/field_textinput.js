'use strict';

// Field text input

// Inspiration and ideas for implementation http://making.fiftythree.com/fluid-text-inputs/
// TODOs:
//    - Report Android bug when have 25 characters (TODO: report this bug)
//    - Implement granular character handling (user pair evaluation), performance issue with more than 250 characters
//    - Implement doubletap selection (selects all text)
//    - Better handling of draggable parent
//    - Fix bug when scroll rigth and delete with backspace, bad repositioning (may be bad offset handling).

BB.FieldTextInput = BB.Field.prototype.create({
  // TODO: invert text color when are selected, note that is not trivial.
  constructor: function(text, parent, options)  {
    BB.Field.prototype.constructor.call(this, 'TextInput');
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
    this.size = 15; // px default metrics in svg.js library
    this.width_ = 0;
    this.minWidth = 10; // When this is not fluid this don't matters
    this.height_ = this.size + 3;
    // Intenals
    this.style = {
      className: 'BBFieldTextInput',
      editableTextBackground: 'BBEditableTextBackground'
    };
    this.textMetrics_ = null;
    this.textWidth_ = 0;
    this.lastTextWidth_ = 0;
    this.initialSpaceX_ = 1;
    this.initialSpaceY_ = 1;
    this.finalSpaceX_ = 1;
    this.finalSpaceY_ = 1;
    this.textRootOffset_ = 1;
    this.offsetX_ = 0; // X scroll offset relative to the text (one line textInput doesn't need offsetY)
    this.initialCursorY_ = 1; // Vertical cursor initial separation relative to SVG element
    this.initialCursorX_ = 0; // Horizontal cursor initial separation relative to SVG element
    this.cursor = null;
    this.cursorXY = {x: 0, y: 0};
    this.cursorState = 0; //0: off, 1: on
    this.cursorInterval = null;
    this.selectable = true;
    this.draggableIndex = -1; // Index of this in attachDraggable array in the parent (if exists)
    this.fluid = true; // fluid or normal text input, true by default

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
    this.optionList = [['fontColor', 'public'],
                       ['fontFamily', 'public'],
                       ['fontSize', 'public'],
                       ['minWidth', 'public'],
                       ['height', 'private'],
                       ['fluid', 'public']];
    for (var i = 0,el; el = this.optionList[i]; i++) {
      if (options.hasOwnProperty(el[0])) {
        var opt = (el[1] == 'public') ? el[0] : el[0] + '_';
        this[opt] = options[el[0]];
      }
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
    if (!this.rendered_) {
      this.container = this.parent.container.group().addClass(this.style.className);
      // Background
      this.mainBackground = this.container.rect(0,0);
      // Nested svg as a root allows to use overflow css property
      this.root = this.container.nested().attr('style', 'overflow: hidden;');
      //Mirror root for cursor position, this contains 0 to cursorPosition text (metrics)
      this.mirrorRoot = this.root.text(this.text).font({
        family: this.fontFamily
        , size: this.fontSize}).fill(this.fontColor).move(this.textRootOffset_, 0) //BUG: svg.js bug when add text to a group
        .style('text-rendering: geometricPrecision');
      // Computes text length
      var textLength = this.mirrorRoot.node.getComputedTextLength();
      this.textWidth_ = textLength;
      this.setWidth(textLength);
      this.mainBackground.size(this.width_ + this.initialSpaceX_ + this.finalSpaceX_, this.height_ + this.initialSpaceY_ + this.finalSpaceY_)
        .move(0, 0).addClass(this.style.editableTextBackground).radius(4);
      this.root.size(this.width_, this.height_).move(this.initialSpaceX_, this.initialSpaceY_);
      // Background hides mirrorRoot
      this.background = this.root.rect(this.width_, this.height_).move(0, 0);
      this.selectionRoot =  this.root.rect(0, this.initialCursorY_ + this.size).move(0, 0).fill(this.selectionColor);
      this.textRoot = this.root.text(this.text.replace(/ /g, '\u00a0')).font({
        family: this.fontFamily
        , size: this.fontSize}).fill(this.fontColor).move(this.textRootOffset_, 0) //BUG: svg.js bug when add text to a group
        .style('text-rendering: geometricPrecision'); // when scales keeps proportions
      // Text metrics
      this.getTextMetrics_();
      // Creates a foreign text input for listening keyboard events,
      // this isn't necesary when implemented editable svg text element from SVG 1.2 tiny specification
      // avoid some webkit and blink bugs with textinputs when are rotated and scaled.
      this.foreignTextInput = this.container.foreignObject(0,0).attr({id: 'fobj'})
        .appendChild("input", {type: 'text', value: this.text});
      if (this.fluid) {
        this.setMaxChars(120); // more than 120 characters in one line is not recomended for fluid text inputs
      } else {
        this.setMaxChars(250); // for performance not more than 250 characters
      }
      var this_ = this;

      // Keyboard handler
      var KeyboardHandler = function (e) { // Note that this handles keyup and keydown events
        // compatibility with Chrome and firefox
        var keyId, refreshCursor = false, textChanged = false;
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
              this_.getTextMetrics_(-1, this_.foreignTextInput.getChild(0).selectionStart); // Update text metrics
              textChanged = true; // flag
            }
          }
        } else { // normal keys
          if (this_.text != e.target.value) {
            this_.text = e.target.value;
            this_.textRoot.text(this_.text.replace(/ /g, '\u00a0'));
            this_.getTextMetrics_(-1, this_.foreignTextInput.getChild(0).selectionStart); // Update text metrics
            textChanged = true;
          }
        }
        // getCaretPosition function not used now
        var selectionStart = this_.foreignTextInput.getChild(0).selectionStart, mirrorText,
            selectionEnd = this_.foreignTextInput.getChild(0).selectionEnd, selectionWidth = 0, i,
            caretPos = selectionStart;
        // Computes the width of selectionRoot (the rect for selected text)
        for (i = selectionStart; i < selectionEnd; i++) {
          selectionWidth += this_.textMetrics_[i];
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
        var textLength = this_.mirrorRoot.node.getComputedTextLength();
        // Scrolling and fluid text logic
        if (keyId == 'Left' || keyId == 'Right'
            || keyId == 'Up' || keyId == 'Down' || keyId == 'Home' || keyId == 'End'
            // New keyboard API for firefox see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent.key
            || keyId == 'ArrowLeft' || keyId == 'ArrowRight' || keyId == 'ArrowUp' || keyId == 'ArrowDown'
           ) { // Modify text have a diferent behavior that only moves in it
          if (-this_.offsetX_ > textLength) {
            this_.offsetX_ = -textLength;
          }
        } else { // Logic for scrolling when modify text
          if (!this_.fluid && -this_.offsetX_ + this_.width_ >= this_.lastTextWidth_ && this_.width_ < this_.lastTextWidth_) {
            this_.offsetX_ = (this_.width - this_.textWidth_ > 0) ? 0 : this_.width_ - this_.textWidth_;
          }
        }
        if (!this_.fluid) {
          if (this_.width_ - this_.offsetX_ <= textLength) {
            this_.offsetX_ = this_.width_ - textLength;
          }
        }
        this_.cursor.move(this_.initialCursorX_ + this_.textRootOffset_ + this_.offsetX_ + textLength, this_.initialCursorY_); // Position of cursor
        this_.textRoot.x(this_.initialCursorX_ + this_.offsetX_ + this_.textRootOffset_); // Scrolls the text
        // Moves and resize selectionRoot
        this_.selectionRoot.move(this_.initialCursorX_ + this_.textRootOffset_ + this_.offsetX_ + textLength, this_.initialCursorY_);
        this_.selectionRoot.width(selectionWidth);
        if (textChanged && this_.fluid) {
          this_.setWidth(this_.textWidth_);
        }
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
          mousePos.x -= this_.initialCursorX_ + this_.offsetX_;
          // Find the caret position for this pointerdown event
          for (i = 0, len = this_.textMetrics_.length; i <= len; i++) {
            pos1 = pos2;
            pos2 += ((i == 0) ? 0 : this_.textMetrics_[i - 1]/2) + ((i == len) ? 0 : this_.textMetrics_[i]/2);
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
            this_.showCursor();
            this_.setSelected(true);
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
        this_.referenceOffsetX_ = this_.offsetX_;
      });
      // Selects text with pointer
      this.pointerCaretSelectionHandler = function (e) {
        // console.log('track')
        // Keeps reference to viewport
        var mousePos = mouseToSvg(e, this_.root.node), i, len, pos1 = 0, pos2 = 0;
        // Mouse position relative to scroll
        mousePos.x -= this_.initialCursorX_ + this_.offsetX_;
        // Find the caret position for this pointerdown event
        if (mousePos.x < 0) {
          i = 0;
        } else { 
          for (i = 0, len = this_.textMetrics_.length; i <= len; i++) {
            pos1 = pos2;
            pos2 += ((i == 0) ? 0 : this_.textMetrics_[i - 1]/2) + ((i == len) ? 0 : this_.textMetrics_[i]/2);
            //console.log(pos1 + '<=' + mousePos.x + '<' + pos2) // DEBUGGING LINE
            if (pos1 <= mousePos.x && mousePos.x < pos2) {
              break;
            }
          }
        }
        var reverseSelection = false;
        // Diferential of offset relative to trackstart event
        var doffsetX_ = this_.offsetX_ - this_.referenceOffsetX_;
        if (e.dx >= doffsetX_) {
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
          selectionWidth += this_.textMetrics_[i];
        }
        if (selectionWidth == 0) {
          this_.showCursor();
        } else {
          this_.hideCursor();
        }
        //console.log('up:' + selectionWidth);
        var textLength = this_.mirrorRoot.node.getComputedTextLength();
        if (!this_.fluid)
        // Scrolling logic
        var selectionDx = (reverseSelection?-1:1)*selectionWidth;
        if (-this_.offsetX_ > textLength + selectionDx) {
          this_.offsetX_ = -textLength - selectionDx;
        }
        if (this_.width_ - this_.offsetX_ <= textLength + selectionDx) {
          this_.offsetX_ = this_.width_ - textLength - selectionDx;
        }
        this_.textRoot.x(this_.initialCursorX_ + this_.offsetX_ + this_.textRootOffset_); // Scrolls the text
        // Moves and resize selectionRoot
        this_.selectionRoot.move(this_.initialCursorX_ + this_.textRootOffset_ + this_.offsetX_ + textLength - (reverseSelection?selectionWidth:0), this_.initialCursorY_);
        this_.selectionRoot.width(selectionWidth);
        this_.setSelected(true);
      };
      this.rendered_ = true;
      var tempSelected = this.selected_;
      this.selected_ = !this.selected_;
      this.setSelected(tempSelected);
    } else {
      this.updateRender();
    }
  
  },

  showCursor: function (pos) {
    if (pos) {
      this.cursorXY = pos;
    } else {
      var textLength = this.mirrorRoot.node.getComputedTextLength();
      this.cursorXY.x = this.initialCursorX_ + this.textRootOffset_ + this.offsetX_ + textLength;
      this.cursorXY.y = this.initialCursorY_;
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
  getTextMetrics_: function (keydiff, position) {
    var tempMirrorText = this.text, lastWidth = 0;
    // Keeps last value
    this.lastTextWidth_ = this.textWidth_;
    // Calc text metrics
    var textMetrics_, textLength, textLength2, textLength3, dx1, dx2;
    if (keydiff == undefined || this.textMetrics_ == null) { // Calcs metrics of a whole text
      textMetrics_ = [];
      for (var i = 1, len = this.text.length; i <= len; i++) {
        tempMirrorText = this.text.substr(0, i);
        this.mirrorRoot.text(tempMirrorText.replace(/ /g, '\u00a0')); // TODO: make a setText method that functionality
        textLength = this.mirrorRoot.node.getComputedTextLength();
        textMetrics_.push(textLength - lastWidth);
        lastWidth = textLength;
      }
    } else {
      if (position == undefined) {
        throw 'If keydiff are defined position is not optional';
      }
      if (keydiff == -1 && this.text != this.lastText) {
        textMetrics_ = this.textMetrics_;
        tempMirrorText = this.text.substr(0, position - 1);
        this.mirrorRoot.text(tempMirrorText.replace(/ /g, '\u00a0')); // TODO: make a setText method that functionality
        textLength = this.mirrorRoot.node.getComputedTextLength();
        tempMirrorText = this.text.substr(0, position);
        this.mirrorRoot.text(tempMirrorText.replace(/ /g, '\u00a0')); // TODO: make a setText method that functionality
        textLength2 = this.mirrorRoot.node.getComputedTextLength();
        dx1 = textLength2 - textLength;
        tempMirrorText = this.text.substr(0, position + 1);
        this.mirrorRoot.text(tempMirrorText.replace(/ /g, '\u00a0')); // TODO: make a setText method that functionality
        textLength3 = this.mirrorRoot.node.getComputedTextLength();
        dx2 = textLength3 - textLength2;
        textMetrics_ =  textMetrics_.slice(0, position - 1).concat([dx1].concat(textMetrics_.slice(position)));
        if (dx2 != 0) {
          textMetrics_ =  textMetrics_.slice(0, position).concat([dx2].concat(textMetrics_.slice(position)));
        }
        //console.log(textMetrics_.length + ' : ' + this.text.length)
      }
    }
    // Keeps lastWidth
    this.textWidth_ =  this.textRoot.node.getComputedTextLength();
    // Keeps lastText
    this.lastText = this.text;
    // Restores mirrorRoot text
    this.mirrorRoot.text(this.text.replace(/ /g, '\u00a0'));
    if (textMetrics_ != undefined) {
      this.textMetrics_ = textMetrics_;
    }
  },
  
  onSelect: function() {
    this.foreignTextInput.getChild(0).focus();
    this.background.fill(this.backgroundColor);
    this.mainBackground.fill(this.backgroundColor);
    this.mainBackground.removeClass(this.style.editableTextBackground);
    this.background.opacity(1);
    this.mirrorRoot.opacity(1);
    this.container.removeClass('BBFieldTextInput');
    this.showCursor();
    PolymerGestures.addEventListener(this.root.node, 'track', this.pointerCaretSelectionHandler);
    if (this.parent.attachDraggable) {
      // if is focused not drag the parent
      if (this.parent.container.fixedDrag) {
        this.parent.container.fixedDrag();
      }
      this.parent.attachDraggable = this.parent.attachDraggable.slice(0, this.draggableIndex)
        .concat(this.parent.attachDraggable.slice(this.draggableIndex + 1));
      this.draggableIndex = -1;
    }
  },
  onBlur: function() {
    this.foreignTextInput.getChild(0).blur();
    this.selectionRoot.width(0); // Hides selectionRoot
    this.hideCursor();
    this.mainBackground.addClass(this.style.editableTextBackground);
    this.background.opacity(0);
    this.mirrorRoot.opacity(0);
    this.container.addClass('BBFieldTextInput');
    PolymerGestures.removeEventListener(this.root.node, 'track', this.pointerCaretSelectionHandler);
    // if is not focused drag the parent
    if (this.parent.attachDraggable) {
      this.parent.attachDraggable.push(this.container); // This text can drag all parent
      this.draggableIndex = this.parent.attachDraggable.length - 1;
    }
  },
  onSelectedChange: function() {
    // Updates parent draggable handler
    if (this.parent.attachDraggable) {
      this.parent.updateDraggable();
    }
  },
  onUnRender: function() {
    this.hideCursor();
    this.cursor = null;
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
  
  setWidth: function(width){
    if (width != undefined && typeof(width) == 'number') {
      if (width != this.width_) {
        this.width_ = Math.max(width + 2, this.minWidth);
        if (this.rendered_) {
          this.mainBackground.width(this.width_ + this.initialSpaceX_ + this.finalSpaceX_);
          this.background.width(this.width_);
          this.root.width(this.width_);
          this.parent.fieldChanged(this.index);
        }
      }
    } else {
      throw 'Not valid width';
    }
  },

  // get viewbox, override parent class method
  bbox: function(type){
    if (this.rendered_) {
      var bbox = this.root.viewbox();
      bbox.width_ += this.initialSpaceX_ + this.finalSpaceX_;
      bbox.height_ += this.initialSpaceY_ + this.finalSpaceY_;
      return bbox;
    } else {
      throw 'Only rendered fields have a container';
    }
  }

});
