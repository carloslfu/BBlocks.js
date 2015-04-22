'use strict'

//A Workspace is an SVG document that can contain Blocks, Workspaces and Fields.
BB.Workspace = BB.Component.prototype.create({
  constructor: function(name, workspace, options) {
    this.parentClass_.constructor.call(this, 'Workspace');
    this.name = name;
    this.width = 200;
    this.height = 200;
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
    this.pannable = true;
    this.selectable = true;
    this.style = {
      className: 'BBComponentWorkspace'
    };
    if (!workspace) {
      return;
    }
    this.workspace = workspace;
    // options
    if (!options) {
    // default options
      return;
    }
    // TODO: Implement validation for options
    this.optionList = ['x',
                       'y',
                       'width',
                       'height',
                       'stylingFunction',
                       'colorPalette',
                       'metrics',
                       'selectable',
                       'preserveChildsOnSelect'];
    for (var i = 0,el; el = this.optionList[i]; i++) {
      if (options[el]) {
        this[el] = options[el];
      }
    }
    if (options.pannable != undefined) {
      this.pannable = pannable;
    }
    if (options.render) {
      this.render();
    }
  },

  render: function() {
    if (!this.workspace) {
      throw 'Workspace must have a div identifier or other workspace for be rendered';
    }
    if (!this.rendered_) {
      // allows nested workspaces
      this.nested =!(typeof(this.workspace) === 'string');
      if (this.nested) {
        this.container = this.workspace.root.group();
        this.container.move(this.x, this.y); //position of nested workspace
        this.root = this.container.nested();
        this.root.size(this.width, this.height);
      } else {
        this.root = SVG(this.workspace).fixSubPixelOffset();
        this.root.size('100%', '100%');
        this.width = '100%';
        this.height = '100%';
      }
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
        //this.borderShadow = this.workspace.root.rect(this.width + 4, this.height + 4).fill('none').radius(7).dmove(-2,-2);
        this.borderShadow = this.workspace.root.rect(this.width, this.height).fill('none').radius(5);
        this.border = this.workspace.root.rect(this.width, this.height)
                          .stroke({ color: this.borderColor, opacity: 1, width: 4 }).fill('none').radius(5);
        this.container.add(this.borderShadow);
        this.container.add(this.border);
        this.container.add(this.dragBox);
        this.container.add(this.resizeBox);
        this.borderShadow.addClass(this.style.className);
      } else {
        this.root.attr('style', 'border: 1px solid ' + this.borderColor + ';');
      }
      this.root.attr('style', 'overflow: hidden;'); // hide content out of workspace in nested workspaces
      this.childContainer = this.root.group();
      this.text = this.root.text(this.level + '');
      //this.text = this.root.text(this.name + ' ( level: ' + this.level + ')'); // for debugging
      this.children.push({container: this.text,
                          move: function(x,y){this.container.move(x,y)}
                         });
      this.childContainer.add(this.text);
      for (var i = 0; i < this.children.length; i++) {
        if (!this.children[i].rendered && this.children[i].render) {
          this.children[i].render();
        }
      }
      if (this.nested) {
        this.container.draggable(this, null, [this.dragBox, this.border]);
        this.container.resizable(this, null, [this.resizeBox]);
        this.workspace.childContainer.add(this.container);
      }
      this.attachPannable = [this.background, this.text];
      if (this.pannable) {
        this.childContainer.pannable(this, null, this.attachPannable, [this.childContainer]);
      }
      // unselect all childrens when pointerdown
      var this_ = this;
      var els = (this.nested) ? this.attachPannable.concat([this.dragBox, this.border, this.resizeBox]) : this.attachPannable;
      BB.attachToEls(els, 'down', function() {
        this_.setSelected(true);
        this_.unselectChilds();
      });
      this.attachScalable = [this.background, this.text];
      for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].type == 'Block') {
          this.attachScalable.push(this.children[i]);
        }
      };
      this.childContainer.scalable(this, null, this.attachScalable);
      this.rendered_ = true;
      if (this.nested) {
        var bbox = this.container.bbox();
        this.offsetX = this.x - bbox.x;
        this.offsetY = this.y - bbox.y;
        this.offsetX2 = this.x + this.height + this.offsetX - bbox.x2;
        this.offsetY2 = this.y + this.width + this.offsetY - bbox.y2;
      }
    }
    return this;
  },

  childRendered: function(child) {
    if (child.type == 'Block') {
      this.attachScalable.push(child.container);
      this.childContainer.scalable(this, null, this.attachScalable);
    }
  },

  toScale: function(scale) {
    var fScale = scale/this.scale;
    this.childContainer.scale(scale);
    this.scale = scale;
    this.notifyScaling(fScale);
  },
  // Notify all childrens
  notifyScaling: function(fScale) {
    // set absoluteScale to svg.js context for pannable elements
    this.children.forEach(function(el) {
      if (el.type == 'Workspace') { //only notify the workspaces
        el.absoluteScale *= fScale;
        el.notifyScaling(fScale);
      }
    });
  },

  resize: function(width, height) {
    this.width = width;
    this.height = height;
    this.border.size(width, height);
    this.borderShadow.size(width, height);
    this.root.size(width, height);
    this.background.size(width, height);
    this.resizeBox.move(this.width-5, this.height-5);
  },
  setWidth: function(width) {
    this.width = width;
    this.border.width(width);
    this.borderShadow.width(width);
    this.root.width(width);
    this.background.width(width);
    this.resizeBox.x(this.width-5);
  },
  setHeight: function(height) {
    this.height = height;
    this.border.height(height);
    this.borderShadow.height(height);
    this.root.height(height);
    this.background.height(height);
    this.resizeBox.y(this.height-5);
  },
  /**
   * Zooming the workspace centered in (x,y) coordinate with zooming in or out.
   * @param {!number} x X coordinate of center.
   * @param {!number} Y coordinate of center.
   * @param {!number} type Type of zomming (-1 zooming out and 1 zooming in).
   */
  zoom: function(x ,y , type, delta) {
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
});