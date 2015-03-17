'use strict'

//namespace for BB
var BB = {};

// prototype for Workspace and Blocks
BB.Object = function(type) {
  this.type = type;
  this.children = [];
  this.nested = false;
  this.level = 0; //level of nesting 0 - main Object
  this.absoluteRotation = 0;
  this.rotation = 0;
  this.offsetX = 0; // offset with the svg root
  this.offsetY = 0;
  this.offsetX2 = 0;
  this.offsetY2 = 0;
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

BB.Object.prototype.addBlock_ = function(block) {
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

BB.Object.prototype.addBlock = function(name, block_prototype) {
  // generate the block object
  var block = this.createBlock(name, block_prototype);
  return this.addBlock_(new block());
};

// create a block object from a protoype
BB.Object.prototype.createBlock = function(name, block_prototype) {
  if (!block_prototype) {
    throw 'Must have a block protoype as argument';
    return;
  }
  if (!block_prototype.init) {
    throw 'Block protoype must have a init function';
    return;
  }
  // generate the block object
  var block = function(options){
    BB.Block.call(this, name, options);
  };
  block.prototype = Object.create(BB.Block.prototype);
  mixin(block, block_prototype, true); // extend block with block_prototype
  return block;
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
//facades for svg functions
BB.Object.prototype.rotate = function(rotation) {
  if (this.container) { // main Workspaces don't have container
    var dRotation = rotation - this.rotation;
    var bbox = this.container.bbox();
    this.rotation = rotation;
    this.notifyRotation(dRotation);
    return this.container.rotate(rotation, bbox.x + this.width/2 + this.offsetX,
                          bbox.y + this.height/2 + this.offsetY);
  }
};
BB.Object.prototype.notifyRotation = function(dRotation) { // this should be only for workspaces - last TODO
  this.absoluteRotation += dRotation; // set absoluteScale to svg.js context for pannable elements
  this.children.forEach(function(el) {
    if (el.notifyRotation) {
      el.notifyRotation(dRotation);
    }
  });
};
BB.Object.prototype.move = function(x, y) {
  if (this.container) { // main Workspaces don't have container
    this.x = x + this.offsetX;
    this.y = y + this.offsetY;
    return this.container.move(this.x, this.y);
  }
};
BB.Object.prototype.dmove = function(dx, dy) {
  if (this.container) { // main Workspaces don't have container
    this.x += dx;
    this.y += dy; 
    return this.container.dmove(dx, dy);
  }
};
BB.Object.prototype.animate = function() {
  if (this.container) { // main Workspaces don't have container
    return this.container.animate.apply(this.container, arguments);
  }
};