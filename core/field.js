'use strict'

// Fields are elements of blocks

BB.Field = BB.Object.prototype.create({
  contructor: function(type){
    this.type = type;
    this.rendered = false;
  },

//this field to top of this parent
  toTop: function() {
    if (this.parent) {
      this.parent.container.node.appendChild(this.root.node); // this in top of parent
    }
  }
});