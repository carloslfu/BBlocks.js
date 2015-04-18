'use strict'

// Field text
BB.FieldButton = BB.Field.prototype.create({
  constructor: function(text, parent, ondown, options)  {
    this.parentClass_.constructor.call(this, 'Button');
    this.children = [];
    this.container = null; // contains attached elements(border) and SVG document
    this.childContainer = null; // svg group that contains all children
    this.root = null;
    this.width = 0;
    this.height = 0;
    this.style = {
      className: 'BBFieldButton',
      classPressedName: 'BBFieldButtonPressed',
      text: {
        fontFamily: 'sans-serif',
        fontColor: '#fff',
        size: 15 // px default metrics in svg.js library
      }
    }
    if (text && typeof(text) == 'string') {
      this.text = text;
    } else {
      throw 'Text must be a valid string';
      return;
    }
    if (ondown) {
      this.ondown = ondown;
    }
    if (parent) {
      this.parent = parent;
    }
    if (!options) {
      return;
    }
    if (options.style) {
      this.style = options.style;
    }
    if (options.render) {
      this.render();
    }
  },

  render: function(){
    if (!this.parent) {
      throw 'FieldButton must have a parent to be rendered';
      return;
    }
    if (!this.rendered_) {
      this.container = this.parent.container.group()
        .addClass(this.style.className);
      this.textSvg = this.container.text(this.text)
        .font({
          family: this.style.text.fontFamily
          , size: this.style.text.fontSize
        }).fill(this.style.text.fontColor)
        .move(7, 0)
        // TODO: report bug in svg.js when add a text in a container,
        //       don't positioned that properly, this happens when don't calls move function,
        //       by default should be in 0,0 coordinate
        .style('text-rendering: geometricPrecision');
      var textBBox = this.textSvg.bbox();
      this.width = textBBox.width + 14;
      this.height = textBBox.height;
      this.root = (new SVG.Rect).size(this.width, this.height).radius(3);
      this.container.node.insertBefore(this.root.node,this.textSvg.node); // Add root before text(the rect)
        // when scales keeps text proportions
    }
    var this_ = this;
    PolymerGestures.addEventListener(this.container.node, 'down', function(event) {
      this_.container.addClass(this_.style.classPressedName);
      if (this_.ondown) {
        this_.ondown();
      } else {
        // for debugging
        console.log('(Degug) FieldButton don\'t have a ondown handler! .\n Text: ' + this_.text);
      }
      event.preventDefault(); // Don't select text
    });
    PolymerGestures.addEventListener(this.container.node, 'up', function() {
      this_.container.removeClass(this_.style.classPressedName);
    });
    this.rendered_ = true;
  }
});