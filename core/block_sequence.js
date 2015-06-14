// Block sequence container

BB.BlockSequence = ObjJS.prototype.create({
  constructor: function(name, workspace) {
    this.name = name;
    this.workspace = workspace;
    this.children = [];
    this.parent = workspace;

    this.selectable = true;
    this.selected_ = false;
  },
  addBlock: function(block) {
    if (block.workspace == this.workspace) {
      // if is the first block
      if (this.children.length == 0) {
        this.x = block.x;
        this.y = block.y;
      }
      this.children.push(block);
      block.parent = this;
      block.workspace.removeChild(block.index_);
    } else {
      throw 'Move a block from a diferent workspace are not implemented'; // TODO: Move a block from a diferent workspace
    }
  },
  setSelected: function(bool) {
    if (this.selectable && this.selected_ != bool) { // performance optimization and avoids infinite loops
      this.selected_ = bool;
      if (this.selected_) {
        this.toTop();
        if (this.onSelect) {
          this.onSelect();
        }
      } else {
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
  //this object to top of this parent Workspace
  toTop: function() {
    if (this.nested) {
      this.workspace.childContainer.node.appendChild(this.container.node); // this in top of SVG
    }
  }
});
