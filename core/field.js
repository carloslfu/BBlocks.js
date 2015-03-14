'use strict'

// Fields are elements of blocks
BB.Field = function(type) {
  this.type = type;
  this.rendered = false;
};

//this object to top of this parent
BB.Field.prototype.toTop = function() {
  if (this.parent) {
    this.parent.container.node.appendChild(this.root.node); // this in top of SVG
  }
};