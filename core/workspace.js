'use strict'

BB.Workspace = function(name, workspace, options) {
	this.name = name;
  this.width = '100%';
  this.height = '100%';
  this.x = 0;
  this.y = 0;
  this.border = null;
  this.background = null;
  this.hasBorder = true;
	if (!workspace) {
		return;
	}
	this.workspace = workspace;
	//woorkspace not rendered
	this.rendered = false;
  this.root = null;
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
    var color = this.nested ? '#eee' : '#fff';
    this.background = this.root.rect(this.width, this.height).fill(color);
    if (this.hasBorder) {
      if (this.nested) {
        this.border = this.root.rect(this.width, this.height).stroke({ color: '#dd0', opacity: 1, width: 4 }).fill('none').radius(5);
      } else {
        this.root.attr('style', 'border: 1px solid #ddd;');
      }
    } else {
      this.border = this.root.rect(this.width, this.height).stroke({ color: '#fff', opacity: 1, width: 4 }).fill('none').radius(5);
    }
    this.root.attr('style', 'overflow: hidden;'); // hide content out of workspace in nested workspace
    if (this.nested) {
      this.root.draggable(null ,this.border);
      this.root.pannable(null ,this.background, [this.background, this.border]);
    } else {
      this.root.pannable(null ,this.background, [this.background]);
    }
	}
};