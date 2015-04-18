'use strict'

// Field text
BB.FieldText = BB.Field.prototype.create({
  constructor: function(text, parent, options)  {
    this.parentClass_.constructor.call(this, 'Text');
    this.children = [];
    this.container = null; // contains attached elements(border) and SVG document
    this.childContainer = null; // svg group that contains all children
    this.root = null;
    this.fontFamily = 'sans-serif';
    this.fontColor = '#fff';
    this.size = 15; // px default metrics in svg.js library
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
    if (options.render) {
      this.render();
    }
  },

  render: function(){
    if (!this.parent) {
      throw 'FieldText must have a parent to be rendered';
      return;
    }
    if (!this.rendered_) {
      this.container = this.parent.container.text(this.text).font({
        family: this.fontFamily
        , size: this.fontSize}).fill(this.fontColor)
        .style('text-rendering: geometricPrecision'); // when scales keeps proportions
    }
    if (this.parent.attachDraggable) {
      this.parent.attachDraggable.push(this.container); // This text can drag all parent
    }
    this.rendered_ = true;
  }
});