'use strict'

//namespace for BB
var BB = {};

// prototype for Workspace and Blocks
BB.Object = function(type) {
  this.type = type;
  this.nested = false;
  this.level = 0; //level of nesting 0 - main Object
};

BB.Object.prototype.add = function(type, name, options) {
	switch(type) {
    case 'Block':
      break;
    case 'Workspace':
      this.children.push(new BB.Workspace(name, this, options));
      this.children[this.children.length-1].level = this.level + 1;
      return this.children[this.children.length-1];
  }
};

//this object to top of this parent Workspace
BB.Object.prototype.toTop = function() {
  if (this.nested) {
    this.workspace.childContainer.node.appendChild(this.container.node); // this in top of SVG
  }
}

//this object to top of this parent Workspace and all parents
BB.Object.prototype.toTopPropagate = function() {
  var obj = this;
  if (this.nested) {
    this.workspace.childContainer.node.appendChild(this.container.node); // this in top of SVG
    while (obj.workspace.nested) { //parents in top of our respectives SVGs
      obj = obj.workspace;
      obj.workspace.childContainer.node.appendChild(obj.container.node);
    }
  }
}