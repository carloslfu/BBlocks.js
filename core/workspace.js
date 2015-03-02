'use strict'

BB.Workspace = function(name, workspace, options) {
	this.name = name;
  this.width = '100%';
  this.height = '100%';
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
    // styling
    this.root.size(this.width, this.height);
    if (this.hasBorder) {
      if (this.nested) {
        this.root.rect(this.width, this.height).stroke({ color: '#dd0', opacity: 1, width: 1 }).fill('#fff').radius(5);
      } else {
        this.root.attr('style', 'border: 1px solid #ddd;');
      }
    }
	}
};