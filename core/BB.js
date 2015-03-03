'use strict'

//namespace for BB
var BB = {};

BB.Object = function(type) {
  this.type_ = type;
  this.children = [];
  this.nested = false;
};

BB.Object.prototype.add = function(type, name, options) {
	switch(type) {
    case 'Block':
      break;
    case 'Workspace':
      this.children.push(new BB.Workspace(name, this, options));
      return this.children[this.children.length-1];
  }
};