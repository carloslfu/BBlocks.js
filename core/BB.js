'use strict'

//namespace for BB
var BB = {};

BB.Object = function(type) {
  this.type_ = type;
  this.children = [];
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