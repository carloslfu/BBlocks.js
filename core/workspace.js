'use strict'

//A workspace is an SVG document that can contain Blocks or Workspaces
BB.Workspace = function(name, workspace, options) {
	this.name = name;
  this.width = '100%';
  this.height = '100%';
  this.x = 0;
  this.y = 0;
  this.border = null;
  this.background = null;
  this.hasBorder = true;
  this.paletteColors = {
    background: {
      nested: '#eee',
      main: '#fff'
    },
    border: {
      nested: '#dd0',
      main: '#ddd'
    },
  };
	if (!workspace) {
		return;
	}
	this.workspace = workspace;
	//woorkspace not rendered
	this.rendered = false;
	// options
	if (!options) {
    //default options
    this.render();
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
  if (options.hasOwnProperty('hasBorder')) {
    this.hasBorder = options.hasBorder;
  }
};

// Workspace inerits from Object
BB.Workspace.prototype = new BB.Object("Workspace");
BB.Workspace.prototype.constructor = BB.Workspace;

BB.Workspace.prototype.render = function() {
	if (!this.rendered) {
		this.rendered = true;
		// allows nested workspaces
    this.nested =!(typeof(this.workspace) === 'string');
		this.root = this.nested ? this.workspace.root.nested() : SVG(this.workspace);
    //position and size
    this.root.move(this.x, this.y);
    this.root.size(this.width, this.height);
    // styling
    var bgColor = this.paletteColors.background[this.nested ? 'nested' : 'main'];
    var borderColor = this.paletteColors.border[this.nested ? 'nested' : 'main'];
    this.background = this.root.rect(this.width, this.height).fill(bgColor);
    if (this.hasBorder) {
      if (this.nested) {
        this.border = this.root.rect(this.width, this.height).stroke({ color: borderColor, opacity: 1, width: 4 }).fill('none').radius(5);
      } else {
        this.root.attr('style', 'border: 1px solid ' + borderColor + ';');
      }
    } else {
      this.border = this.root.rect(this.width, this.height).stroke({ color: borderColor, opacity: 1, width: 4 }).fill('none').radius(5);
    }
    this.root.attr('style', 'overflow: hidden;'); // hide content out of workspace in nested workspace
    if (this.nested) {
      this.root.draggable(null ,this.border);
      this.root.pannable(null ,this.background, [this.background, this.border]);
      var el = this; //for the next closure
      this.root.dragstart = function() {
        el.toTop(); //focus workspace
      };
      this.root.panstart = function() {
        el.toTop(); //focus workspace
      };
    } else {
      this.root.pannable(null ,this.background, [this.background]);
    }
    this.root.text(this.level + '');
	}
};