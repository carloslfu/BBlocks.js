'use strict'

// A Workspace is an SVG document that can contain Blocks, Workspaces and Fields.
//  This is an abstract Workspace class, don't instance this.
//  All instantiable workspaces live in workspaces folder or create your own using the Workspace API
// TODOs:
//  - scrolling of workspaces
//  - trash (after allows blocks to be removed)
//  - documentation for Workspace API

BB.Workspace = BB.Component.prototype.create({
  constructor: function(name, workspacePrototype, workspace, options) {
    BB.Component.prototype.constructor.call(this, 'Workspace');
    this.name = name;
    this.title = '';
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
    this.attachedElements = [];
    this.style = {
      className: 'BBComponentWorkspace'
    };
    if (workspacePrototype) {
      ObjJS.mixinObj(this, workspacePrototype, 'true');
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
                       'title',
                       'preserveChildsOnSelect'];
    for (var i = 0,el; el = this.optionList[i]; i++) {
      if (options.hasOwnProperty(el)) {
        this[el] = options[el];
      }
    }
    if (options.pannable != undefined) {
      this.pannable = pannable;
    }
    if (options.render && !!workspace) {
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
      this.style.blockDisabledPattern = this.root.pattern(10, 10, function(add) {
        add.rect(10,10).fill('#aaa')
        add.path('M 0 0 L 10 10 M 10 0 L 0 10').stroke('#cc0')
      });
      if (!this.colorPalette) {
        this.colorPalette = BB.colorPalettes.workspace.light; //default palette
      }
      // styling
      this.bgColor = this.colorPalette.background[this.nested ? 'nested' : 'main'];
      // render elements
      this.background = this.root.rect(this.width, this.height).fill(this.bgColor);
      this.root.attr('style', 'overflow: hidden;'); // hide content out of workspace in nested workspaces
      this.childContainer = this.root.group();
      //this.text = this.root.text(this.level + ''); //TODO: add this to WorkspaceBasic like an example of how attach elements manually
      //this.text = this.root.text(this.name + ' ( level: ' + this.level + ')'); // for debugging
      /*this.children.push({container: this.text,
                          move: function(x,y){this.container.move(x,y)}
                         });
      this.childContainer.add(this.text);*/
      for (var i = 0; i < this.children.length; i++) {
        if (!this.children[i].rendered && this.children[i].render) {
          this.children[i].render();
        }
      }
      if (this.nested) {
        this.workspace.childContainer.add(this.container);
      }
      this.attachPannable = [this.background];//, this.text];
      if (this.pannable) {
        this.childContainer.pannable(this, null, this.attachPannable, [this.childContainer]);
      }
      if (this.init) {
        this.attachedElements = this.init();
        if (this.workspace) { // attached elements can scale his workspace
          var i, len = this.attachedElements.length;
          for (i = 0; i < len; i++) {
            this.attachedElements[i].scalable(this.workspace, this.attachedElements);
          }
        }
      }
      if (this.stylingFunction) {
        this.stylingFunction();
      }
      // unselect all childrens when pointerdown
      var this_ = this;
      BB.attachToEls(this.attachPannable, 'down', function() {
        this_.setSelected(true);
        this_.unselectChilds();
      });
      // attached elements selects workspace
      BB.attachToEls(this.attachedElements, 'down', function() {
        this_.setSelected(true);
      });
      this.attachScalable = [this.background];//, this.text];
      for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].type == 'Block') {
          this.attachScalable.push(this.children[i]);
        }
      };
      this.childContainer.scalable(this, null, this.attachScalable);
      this.rendered_ = true;
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
    this.root.size(width, height);
    this.background.size(width, height);
    if (this.onResize) {
      this.onResize(width, height);
    }
  },
  setWidth: function(width) {
    this.width = width;
    this.root.width(width);
    this.background.width(width);
    if (this.onWidthChanged) {
      this.onWidthChanged(width);
    }
  },
  setHeight: function(height) {
    this.height = height;
    this.root.height(height);
    this.background.height(height);
    if (this.onHeightChanged) {
      this.onHeightChanged(height);
    }
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
  },

  // Methods to adding components to the workspace

  addWorkspace: function(name, workspacePrototype, options) {
    // generate the block object
    //var workspace = this.createWorkspace(name, workspacePrototype);
    return this.addWorkspace_(new BB.Workspace(name, workspacePrototype, this, options));
  },
  addWorkspace_: function(workspace) {
    if (this.type == 'Block') {
      throw 'Blocks can\'t have Workspaces attached';
      return; //blocks can't have Workspaces attached
    }
    this.children.push(workspace);
    this.children[this.children.length - 1].index_ = this.children.length - 1;
    this.children[this.children.length - 1].level = this.level + 1;
    this.children[this.children.length - 1].parent = this;
    if (this.childAdded) {
      this.childAdded(this.children[this.children.length - 1]); //callback
    }
    return this.children[this.children.length - 1];
  }, 

  addBlock: function(name, blockPrototype, options) {
    // generate the block object
    var block = this.createBlock(name, blockPrototype);
    return this.addBlock_(new block(options));
  },
  addBlock_: function(block) {
    if (block.type != 'Block') {
      throw 'The type of object must be Block';
      return;
    }
    this.children.push(block);
    block.workspace = this;
    block.index_ = this.children.length - 1;
    block.parent = this;
    block.absoluteRotation = block.absoluteRotation + this.absoluteRotation;
    if (this.childAdded) {
      this.childAdded(this.children[this.children.length - 1]); //callback
    }
    return this.children[this.children.length - 1];
  },
  // create a block object from a protoype
  createBlock: function(name, blockPrototype) {
    if (!blockPrototype) {
      throw 'Must have a block protoype as argument';
      return;
    }
    if (!blockPrototype.init) {
      throw 'Block protoype must have a init function';
      return;
    }
    // Add a constructor to prototype
    blockPrototype.constructor = function(options){
      BB.Block.call(this, name, options);
    };
    var block = BB.Block.prototype.create(blockPrototype);
    return block;
  },
  addBlockSequence: function(name) {
    var container = (new BB.BlockSequence(name, this)).render();
    this.children.push(container);
    container.index_ = this.children.length - 1;
    container.parent = this;
    if (this.childAdded) {
      this.childAdded(this.children[this.children.length - 1]); //callback
    }
    return this.children[this.children.length - 1];
  },

  getAllBlocks: function(exceptions) {
    var blocks = [];
    for (var i = 0, child; child = this.children[i]; i++) {
      if (exceptions && exceptions.indexOf(child) != -1) {
        continue;
      }
      if (child.type == 'Block') {
        blocks.push(child);
      } else if (child.type == 'BlockSequence') {
        blocks = blocks.concat(child.getAllBlocks(exceptions));
      }
    }
    return blocks;
  },
});