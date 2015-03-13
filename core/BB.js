'use strict'

//namespace for BB
var BB = {};

// prototype for Workspace and Blocks
BB.Object = function(type) {
  this.type = type;
  this.nested = false;
  this.level = 0; //level of nesting 0 - main Object
};

BB.Object.prototype.addWorkspace = function(workspace, options) {
  if (this.type == 'Block') {
    throw 'Blocks can\'t have Workspaces attached';
    return; //blocks can't have Workspaces attached
  }
  if (typeof(workspace) == 'string') {
    this.children.push(new BB.Workspace(workspace, this, options));
  } else if (typeof(workspace) == 'object'){
    if (workspace.type != 'Workspace') {
      throw 'The type of object must be Workspace';
      return;
    }
    this.children.push(workspace);
  } else {
    throw 'This function only receives workspace name or Workspace object';
  }
  this.children[this.children.length-1].level = this.level + 1;
  if (this.childAdded) {
    this.childAdded(this.children[this.children.length-1]); //callback
  }
  return this.children[this.children.length-1];
};

BB.Object.prototype.addBlock = function(block) {
  if (block.type != 'Block') {
    throw 'The type of object must be Block';
    return;
  }
  this.children.push(block);
  this.children[this.children.length-1].workspace = this;
  if (this.childAdded) {
    this.childAdded(this.children[this.children.length-1]); //callback
  }
  return this.children[this.children.length-1];
};

//this object to top of this parent Workspace
BB.Object.prototype.toTop = function() {
  if (this.nested) {
    this.workspace.childContainer.node.appendChild(this.container.node); // this in top of SVG
  }
};

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
};