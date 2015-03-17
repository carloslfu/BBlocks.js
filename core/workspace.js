'use strict'

//A workspace is an SVG document that can contain Blocks or Workspaces
BB.Workspace = function(name, workspace, options) {
  BB.Object.call(this, 'Workspace');
  this.name = name;
  this.width = '100%';
  this.height = '100%';
  this.x = 0;
  this.y = 0;
  this.container = null; // contains attached elements(border) and SVG document
  this.childContainer = null; // svg group that contains all childrens
  this.absoluteScale = 1;
  this.scale = 1;
  this.absoluteRotation = 0;
  this.rotation = 0;
  this.border = null;
  this.background = null;
  this.dragBox = null;
  this.resizeBox = null;
  this.scaleSpeed = 1.2;
  this.minScale = 0.3;
  this.maxScale = 10;
  this.offsetX = 0; // offset with the svg root
  this.offsetY = 0;
  this.offsetX2 = 0;
  this.offsetY2 = 0;
  this.centerOffsetX = 0;
  this.centerOffsetY = 0;
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
  if (options.colorPalette) {
    this.colorPalette = options.colorPalette;
  }
	if (options.render) {
    this.render();
  }
};

// Workspace inerits from Object
BB.Workspace.prototype = Object.create(BB.Object.prototype);

BB.Workspace.prototype.render = function() {
  if (!this.rendered) {
    // allows nested workspaces
    this.nested =!(typeof(this.workspace) === 'string');
    if (this.nested) {
      this.container = this.workspace.root.group();
      this.container.move(this.x, this.y); //position of nested workspace
    }
    this.root = this.nested ? this.container.nested() : SVG(this.workspace).fixSubPixelOffset();
    this.root.size(this.width, this.height); 
    if (!this.colorPalette) {
      this.colorPalette = BB.colorPalettes.workspace.light; //default palette
    }
    // styling
    this.bgColor = this.colorPalette.background[this.nested ? 'nested' : 'main'];
    this.borderColor = this.colorPalette.border[this.nested ? 'nested' : 'main'];
    this.dragBoxColor = this.colorPalette.dragBoxColor;
    this.resizeBoxColor = this.colorPalette.resizeBoxColor;
    if (this.stylingFunction) {
      this.stylingFunction();
    }
    // render elements
    this.background = this.root.rect(this.width, this.height).fill(this.bgColor);
    if (this.nested) {
      this.dragBox = this.workspace.root.rect(10, 10)
                         .stroke({ color: this.borderColor, opacity: 1, width: 1 })
                         .fill(this.dragBoxColor).radius(1).move(-5, -5);
      this.resizeBox = this.workspace.root.rect(10, 10)
                         .stroke({ color: this.borderColor, opacity: 1, width: 1 })
                         .fill(this.resizeBoxColor).radius(1).move(this.width-5, this.height-5);
      this.border = this.workspace.root.rect(this.width, this.height)
                        .stroke({ color: this.borderColor, opacity: 1, width: 4 }).fill('none').radius(5);
      this.container.add(this.border);
      this.container.add(this.dragBox);
      this.container.add(this.resizeBox);
    } else {
      this.root.attr('style', 'border: 1px solid ' + this.borderColor + ';');
    }
    this.root.attr('style', 'overflow: hidden;'); // hide content out of workspace in nested workspaces
    this.childContainer = this.root.group();
    this.text = this.root.text(this.level + '');
    this.children.push({container: this.text});
    this.childContainer.add(this.text);
    for (var i = 0; i < this.children.length; i++) {
      if (!this.children[i].rendered && this.children[i].render) {
        this.children[i].render();
      }
    }
    if (this.nested) {
      this.container.draggable(this, null, [this.dragBox, this.border]);
      this.container.resizable(this, null, [this.resizeBox]);
      var el = this; //for the next closure
      this.container.dragstart = function() {
        el.toTopPropagate(); //focus workspace
      };
      this.container.resizestart = function() {
        el.toTopPropagate(); //focus workspace
      };
      this.childContainer.panstart = function() {
        el.toTopPropagate(); //focus workspace
      };
      this.workspace.childContainer.add(this.container);
    }
    this.attachPannable = [this.background, this.text];
    this.childContainer.pannable(this, null, this.attachPannable, [this.background]);
    this.attachScalable = [this.background, this.text];
    for (var i = 0; i < this.children.length; i++) {
      if (this.children[i].type == 'Block') {
        this.attachScalable.push(this.children[i]);
      }
    };
    this.childContainer.scalable(this, null, this.attachScalable);
    this.rendered = true;
    if (this.nested) {
      var bbox = this.container.bbox();
      this.offsetX = this.x - bbox.x;
      this.offsetY = this.y - bbox.y;
      this.offsetX2 = this.x + this.height + this.offsetX - bbox.x2;
      this.offsetY2 = this.y + this.width + this.offsetY - bbox.y2;
    }
  }
};
BB.Workspace.prototype.childRendered = function(child) {
  if (child.type == 'Block') {
    this.attachScalable.push(child.container);
    this.childContainer.scalable(this, null, this.attachScalable);
  }
};
BB.Workspace.prototype.toScale = function(scale) {
  var fScale = scale/this.scale;
  this.childContainer.scale(scale);
  this.scale = scale;
  this.notifyScaling(fScale);
};
BB.Workspace.prototype.notifyScaling = function(fScale) {
  this.absoluteScale *= fScale; // set absoluteScale to svg.js context for pannable elements
  this.children.forEach(function(el) {
    if (el.type == 'Workspace') { //only notify the workspaces
      el.notifyScaling(fScale);
    }
  });
};
BB.Workspace.prototype.resize = function(width, height) {
  this.width = width;
  this.height = height;
  this.border.size(width, height);
  this.root.size(width, height);
  this.background.size(width, height);
  this.resizeBox.move(this.width-5, this.height-5);
};

/**
 * Zooming the workspace centered in (x,y) coordinate with zooming in or out.
 * @param {!number} x X coordinate of center.
 * @param {!number} Y coordinate of center.
 * @param {!number} type Type of zomming (-1 zooming out and 1 zooming in).
 */
BB.Workspace.prototype.zoom  = function(x ,y , type, delta) {
  var speed = this.scaleSpeed, dScale;
  var center = this.root.node.createSVGPoint();
  center.x = x;
  center.y = y;
  center = center.matrixTransform(this.childContainer.node.getCTM().inverse());
  var x = center.x;
  var y = center.y;
  // scale factor
  if (delta){
    dScale = delta;
  } else {
    dScale = (type == 1)?speed:1/speed;
  }
  var matrix = this.childContainer.node.getCTM().translate(-(x*(dScale-1)),-(y*(dScale-1))).scale(dScale);
  // validate if scale is in a valid range
  if (matrix.a >= this.minScale && matrix.a <= this.maxScale) {
    this.toScale(matrix.a);
    this.childContainer.move(matrix.e, matrix.f);
  }
}