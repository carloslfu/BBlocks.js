'use strict'

// Fields are elements of blocks
//  This is an abstract Field class, don't instance this.
//  All instantiable fields live in fields folder or create your own using the Field API
// TODO: documentation for Field API

BB.Field = BB.Component.prototype.create({
  constructor: function(type){
    this.type = type;
    this.rendered_ = false;
  },

// get viewbox of element, override this if is necesary
  bbox: function(type){
    if (this.rendered_) {
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