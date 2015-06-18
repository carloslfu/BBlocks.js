'use strict'

// GLOBAL TODOs:
//  - All code documentation following JSDOC

// namespace for BBlocks (BB)
var BB = {};

// Component class, all core classes derivates of this.
//  This is an abstract Component class, don't instance this.
//  Create your own components using the Component API
//    Recomendation: only create components from scratch (created of this class)
//    if you want to do a very different thing that you can not to do with existing components
//    (workspaces, blocks and fields)
// Components that will be implemented (in order of priority)(TODO):
//  - Dropdown field
//  - Menu (for context menus and static menus)
//  - Dialog box
//  - Tab (for tabs handling)
//  - Anything awesome component :)
// TODO: documentation for Component API

BB.Component = ObjJS.prototype.create({
  constructor: function(type) {
    this.type = type;
    this.children = [];
    this.connections = [];
    this.nested = false;
    this.level = 0; //level of nesting 0 - main Object
    this.absoluteRotation = 0;
    this.rotation = 0;
    this.offsetX = 0; // offset with the svg root
    this.offsetY = 0;
    this.offsetX2 = 0;
    this.offsetY2 = 0;
    this.rendered_ = false;
    this.initialized_ = false;
    this.selectable = false;
    this.selected_ = false;
    this.preserveChildsOnUnselect = false; // Don't unselect childs when unselect the component
    this.selectedClass = '';
  },

  setSelected: function(bool) {
    if (this.selectable && this.selected_ != bool) { // performance optimization and avoids infinite loops
      this.selected_ = bool;
      if (this.selected_) {
        this.root.addClass(this.selectedClass);
        this.toTop();
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
  // remove children
  removeChild: function(index) {
    this.childContainer.node.removeChild(this.children[index].container.node);
    this.children.splice(index, 1);
    for (var i = index, len = this.children.length; i < len; i++) {
      this.children[i].index_--;
    }
  },
  //this object to top of this parent Workspace
  toTop: function() {
    if (this.nested) {
      this.parent.childContainer.node.appendChild(this.container.node); // this in top of SVG
    }
  },
  //this object to top of this parent Workspace and all parents (now isn't used - Tag: DEPRECATION_LIST)
  toTopPropagate: function() {
    var obj = this;
    if (this.nested) {
      this.parent.childContainer.node.appendChild(this.container.node); // this in top of SVG
      while (obj.parent.nested) { //parents in top of our respectives SVGs
        obj = obj.parent;
        obj.parent.childContainer.node.appendChild(obj.container.node);
      }
    }
  },
  // Facades for svg functions
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
  // Notify all childrens
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
      this.container.move(this.x, this.y);
      return this;
    } else {
      throw "Main Workspaces don't have container";
    }
  },
  dmove: function(dx, dy) {
    if (this.container) { // main Workspaces don't have container
      this.x += dx;
      this.y += dy; 
      this.container.dmove(dx, dy);
      return this;
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
  },

  updateRender: function() {
    this.unRender();
    this.render();
  },
  unRender: function() {
    var i, len = this.children.length;
    for (i = 0; i < len; i++) {
      if (this.children[i].unRender) {
        this.children[i].unRender();
      }
    }
    if (this.onUnRender) {
      this.onUnRender();
    }
    if (this.container) {
      this.container.remove();
    } else {
      this.root.remove();
    }
    this.rendered_ = false;
  }
});

// attach a event handler to an array of svg.js elements
BB.attachToEls = function(els, eventName, func) {
  var i;
  var len = els.length;
  for (i = 0; i < len; i++) {
    PolymerGestures.removeEventListener(els[i].node, eventName, func);
    PolymerGestures.addEventListener(els[i].node, eventName, func);
  }
};

// attach a event handler to an array of svg.js elements
BB.runCallbacks = function(callbacks, scope, args, avoid) {
  var i;
  var len = callbacks.length;
  for (i = 0; i < len; i++) {
    if (avoid == undefined || avoid != i)
      callbacks[i].apply(scope, args);
  }
};
