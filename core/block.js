'use strict'

// A Block is an svg group that do any behavior, this can contain other Blocks or Workspaces
BB.Block = function(name, workspace, options)  {
  this.name = name;
  this.id = null;
  this.children = [];
  this.x = 0;
  this.y = 0;
  this.width = 50;
  this.height = 20;
  this.container = null; // contains attached elements(border) and SVG document
  this.childContainer = null; // svg group that contains all childrens
  this.statement = true;
  this.nested = true; // Blocks are nested by default
  if (!options) {
  	return;
  }
  if (!workspace) {
    this.workspace = workspace;
  }
  if (options.x) {
    this.x = options.x;
  }
  if (options.y) {
    this.y = options.y;
  }
  if (options.stylingFunction) {
    this.stylingFunction = options.stylingFunction;
  }
  if (options.colorPalette) {
    this.colorPalette = options.colorPalette;
  }
  if (options.render) {
  	this.render();
  }
  };

// Block inerits from Object
BB.Block.prototype = new BB.Object("Block");
BB.Block.prototype.constructor = BB.Block;

BB.Block.prototype.append = function(obj) {
	//this.path = this.workspace;
};

BB.Block.prototype.render = function() {
  if (!this.workspace) {
    throw 'Blocks must have a workspace to be rendered';
    return;
  }
  if (!this.rendered) {
    this.container = this.workspace.root.group();
    this.container.move(this.x, this.y);
    if (!this.colorPalette) {
      this.colorPalette = BB.colorPalettes.block.light; //default palette
    }
    // styling
    this.bgColor = this.colorPalette.background;
    //this.borderColor = this.colorPalette.border[this.nested ? 'nested' : 'main'];
    if (this.stylingFunction) {
      this.stylingFunction();
    }
    // render elements
    this.root = this.workspace.root.rect(this.width, this.height).fill(this.bgColor).radius(5);
    this.childContainer = this.workspace.root.group();
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].render();
      this.childContainer.add(this.children[i].container);
    }
    this.container.add(this.root);
    this.container.add(this.childContainer);
    this.container.draggable(this.workspace ,null ,[this.container]);
    var el = this; //for the next closure
    this.container.dragstart = function() {
      el.toTopPropagate(); //focus workspace
    };
    this.workspace.childContainer.add(this.container);
    this.workspace.childRendered(this);
    this.rendered = true;
  }
};