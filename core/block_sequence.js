// Block sequence container

BB.BlockSequence = ObjJS.prototype.create({
  constructor: function(name, workspace) {
    this.name = name;
    this.workspace = workspace;
    this.children = [];
    this.x
  },
  addBlock: function(block) {
    if (block.workspace == this.workspace) {
      // if is the first block
      if (this.children.length == 0) {
        this.x = block.x;
        this.y = block.y;
      }
      this.children.push(block);
      block.workspace.removeChild(block.index_);
    } else {
      throw 'Move a block from a diferent workspace are not implemented'; // TODO: Move a block from a diferent workspace
    }
  },
});
