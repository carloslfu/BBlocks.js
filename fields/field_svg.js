'use strict'

// Field text
BB.FieldSvg = BB.Field.prototype.create({
  constructor: function(svg, parent, options)  {
    this.parentClass_.constructor.call(this, 'Svg');
    this.children = [];
    this.container = null; // contains attached elements(border) and SVG document
    this.childContainer = null; // svg group that contains all children
    this.root = null;
    if (svg && typeof(svg) == 'object') {
      this.svg = svg;
    } else {
      throw 'Svg must be a valid SVG.js object';
      return;
    }
    if (parent) {
      this.parent = parent;
    }
    if (!options) {
      return;
    }
    if (options.render) {
      this.render();
    }
  },

  render: function(){
    if (!this.parent) {
      throw 'FieldSvg must have a parent to be rendered';
      return;
    }
    if (!this.rendered) {
      this.container = this.svg;
    }
    if (this.parent.attachDraggable) {
      this.parent.attachDraggable.push(this.container); // This text can drag all parent
    }
  }
});