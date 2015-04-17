'use strict'

// Fields are elements of blocks

BB.Field = BB.Component.prototype.create({
  constructor: function(type){
    this.type = type;
    this.rendered = false;
  },

// get viewbox of element, override this if is necesary
  bbox: function(type){
    if (this.rendered) {
      return this.container.bbox();
    } else {
      throw 'Only rendered fields have a container';
    }
  },

// this field to top of this parent
  toTop: function() {
    if (this.parent) {
      this.parent.container.node.appendChild(this.container.node); // this in top of parent
    }
  }
});