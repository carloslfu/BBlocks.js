'use strict'

//A workspace is an SVG document that can contain Blocks or Workspaces
BB.Workspace = function(name, workspace, options) {
	this.name = name;
  this.children = [];
  this.width = '100%';
  this.height = '100%';
  this.x = 0;
  this.y = 0;
  this.container = null; // contains attached elements(border) and SVG document
  this.border = null;
  this.background = null;
	if (!workspace) {
		return;
	}
	this.workspace = workspace;
	//woorkspace not rendered
	this.rendered = false;
	// options
	if (!options) {
    //default options
		return;
	}
	if (options.render) {
    this.render();
  }
  if (options.width) {
    this.width = options.width;
  }
  if (options.height) {
    this.height = options.height;
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
  if (options.paletteColors) {
    this.paletteColors = options.paletteColors;
  }
};

// Workspace inerits from Object
BB.Workspace.prototype = new BB.Object("Workspace");
BB.Workspace.prototype.constructor = BB.Workspace;

BB.Workspace.prototype.paletteColors = {
  background: {
    nested: '#fff',
    main: '#fff'
  },
  border: {
    nested: '#1B65A6',
    main: '#ddd'
  },
};

BB.Workspace.prototype.render = function() {
	if (!this.rendered) {
		this.rendered = true;
		// allows nested workspaces
    this.nested =!(typeof(this.workspace) === 'string');
    if (this.nested) {
      this.container = this.workspace.root.group();
      this.container.move(this.x, this.y); //poition of nested workspace
    }
		this.root = this.nested ? this.container.nested() : SVG(this.workspace).fixSubPixelOffset();
    this.root.size(this.width, this.height);
    // styling
    this.bgColor = this.paletteColors.background[this.nested ? 'nested' : 'main'];
    this.borderColor = this.paletteColors.border[this.nested ? 'nested' : 'main'];
    if (this.stylingFunction) {
      this.stylingFunction();
    }
    this.background = this.root.rect(this.width, this.height).fill(this.bgColor);
    if (this.nested) {
      this.dragBox = this.workspace.root.rect(10, 10).stroke({ color: this.borderColor, opacity: 1, width: 1 }).fill('#369E58').radius(1).move(-5, -5);
      this.resizeBox = this.workspace.root.rect(10, 10).stroke({ color: this.borderColor, opacity: 1, width: 1 }).fill('#808080').radius(1).move(this.width-5, this.height-5);
      this.border = this.workspace.root.rect(this.width, this.height).stroke({ color: this.borderColor, opacity: 1, width: 4 }).fill('none').radius(5);
      this.container.add(this.border);
      this.container.add(this.dragBox);
      this.container.add(this.resizeBox);
    } else {
      this.root.attr('style', 'border: 1px solid ' + this.borderColor + ';');
    }
    this.root.attr('style', 'overflow: hidden;'); // hide content out of workspace in nested workspace
    if (this.nested) {
      this.container.draggable(null ,[this.dragBox, this.border]);
      var el = this; //for the next closure
      this.container.dragstart = function() {
        el.toTopPropagate(); //focus workspace
      };
      this.root.panstart = function() {
        el.toTopPropagate(); //focus workspace
      };
    }
    this.childContainer = this.root.group();
    this.childContainer.add(this.root.text(this.level + ''));
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].render();
      this.childContainer.add(this.children[i].container);
    }
    this.childContainer.pannable(null ,[this.background], [this.background]);
	}
};

BB.Workspace.prototype.toScale = function(scale) {
  var dScale = scale/this.scale;
  this.childContainer.scale(scale);
  this.scale = scale;
  this.notifyScaling(dScale);
};
BB.Workspace.prototype.notifyScaling = function(dScale) {
  this.absoluteScale *= dScale;
  this.children.forEach(function(el) {
    el.notifyScaling(dScale);
  });
}