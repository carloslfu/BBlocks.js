'use strict'

//GLOBAL TODOs:
// - Make all unrender methods (Allows rerender a component)

// namespace for BBlocks (BB)
var BB = {};

// Component class, all derivates of this

BB.Component = ObjJS.prototype.create({
  constructor: function(type) {
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
    this.rendered_ = false;
    this.selectable = false;
    this.selected_ = false;
    this.preserveChildsOnUnselect = false; // Don't unselect childs when unselect component
    this.selectedClass = '';
  },

  setSelected: function(bool) {
    if (this.selectable && this.selected_ != bool) { // performance optimization
      this.selected_ = bool;
      if (this.selected_) {
        this.root.addClass(this.selectedClass);
        if (this.onSelect) {
          this.onSelect();
        }
      } else {
        this.root.removeClass(this.selectedClass);
        if (this.onBlur) {
          this.onBlur();
        }
        if (!this.preserveChildsOnUnselect) {
          this.unselectChilds();
        }
      }
      if (this.onSelectedChange) {
        this.onSelectedChange();
      }
      // Notify parent about this change
      if (this.parent) {
        if (this.selected_ && this.parent.childSelected) {
          this.parent.childSelected(this);
        }
        if (!this.selected_ && this.parent.childUnselected) {
          this.parent.childUnselected(this);
        }
      }
    }
  },

  childSelected: function(child) {
    this.setSelected(true);
    var i, len = this.children.length;
    for (i = 0; i < len; i++) {
      // unselect all childrens except 'child'
      if (this.children[i] != child && this.children[i].setSelected) {
        this.children[i].setSelected(false);
      }
    }
  },

  unselectChilds: function() {
    var i, len = this.children.length;
    for (i = 0; i < len; i++) {
      if (this.children[i].setSelected) {
        this.children[i].setSelected(false);
      }
    }
  },

  addWorkspace: function(workspace, options) {
    if (this.type == 'Block') {
      throw 'Blocks can\'t have Workspaces attached';
      return; //blocks can't have Workspaces attached
    }
    if (typeof(workspace) == 'string') {
      var temp = new BB.Workspace(workspace, this, options);
      this.children.push(temp);
      // inherits absolute rotation
      temp = temp.absoluteRotation + this.absoluteRotation;
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
    this.children[this.children.length-1].parent = this;
    this.children[this.children.length-1].workspace = this;
    if (this.childAdded) {
      this.childAdded(this.children[this.children.length-1]); //callback
    }
    return this.children[this.children.length-1];
  },
  addBlock_: function(block) {
    if (block.type != 'Block') {
      throw 'The type of object must be Block';
      return;
    }
    this.children.push(block);
    block.workspace = this;
    block.parent = this;
    block.absoluteRotation = block.absoluteRotation + this.absoluteRotation;
    if (this.childAdded) {
      this.childAdded(this.children[this.children.length-1]); //callback
    }
    return this.children[this.children.length-1];
  },
  addBlock: function(name, blockPrototype, options) {
    // generate the block object
    var block = this.createBlock(name, blockPrototype);
    return this.addBlock_(new block(options));
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
  //this object to top of this parent Workspace
  toTop: function() {
    if (this.nested) {
      this.workspace.childContainer.node.appendChild(this.container.node); // this in top of SVG
    }
  },
  //this object to top of this parent Workspace and all parents
  toTopPropagate: function() {
    var obj = this;
    if (this.nested) {
      this.workspace.childContainer.node.appendChild(this.container.node); // this in top of SVG
      while (obj.workspace.nested) { //parents in top of our respectives SVGs
        obj = obj.workspace;
        obj.workspace.childContainer.node.appendChild(obj.container.node);
      }
    }
  },
  //facades for svg functions
  rotate: function(rotation) {
    if (this.container) { // main Workspaces don't have container
      var dRotation = rotation - this.rotation;
      var bbox = this.container.bbox();
      this.rotation = rotation;
      this.notifyRotation(dRotation);
      return this.container.rotate(rotation, bbox.x + this.width/2 + this.offsetX,
                            bbox.y + this.height/2 + this.offsetY);
    }
  },
  notifyRotation: function(dRotation) {
    this.absoluteRotation += dRotation; // set absoluteScale to svg.js context for pannable elements
    this.children.forEach(function(el) {
      if (el.notifyRotation) {
        el.notifyRotation(dRotation);
      }
    });
  },
  move: function(x, y) {
    if (this.container) { // main Workspaces don't have container
      this.x = x;
      this.y = y;
      return this.container.move(this.x, this.y);
    } else {
      throw "Main Workspaces don't have container";
    }
  },
  dmove: function(dx, dy) {
    if (this.container) { // main Workspaces don't have container
      this.x += dx;
      this.y += dy; 
      return this.container.dmove(dx, dy);
    } else {
      throw "Main Workspaces don't have container";
    }
  },
  animate: function() {
    if (this.container) { // main Workspaces don't have container
      return this.container.animate.apply(this.container, arguments);
    } else {
      throw "Main Workspaces don't have container";
    }
  }
});

// attach a event handler to an array of svg.js elements
BB.attachToEls = function(els ,eventName, func) {
  var i;
  var len = els.length;
  for (i = 0; i < len; i++) {
    PolymerGestures.removeEventListener(els[i].node, eventName, func);
    PolymerGestures.addEventListener(els[i].node, eventName, func);
  }
};