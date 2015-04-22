'use strict'

// A basic workspace implementation that shows how create workspaces, this is instantiable.
BB.WorkspaceBasic = {
  init: function() {
    // render aditional elements
    this.borderColor = this.colorPalette.border[this.nested ? 'nested' : 'main'];
    if (this.nested) {
      this.dragBoxColor = this.colorPalette.dragBoxColor;
      this.resizeBoxColor = this.colorPalette.resizeBoxColor;
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
      this.container.draggable(this, null, [this.dragBox, this.border, this.borderShadow]);
      this.container.resizable(this, null, [this.resizeBox]);
      var bbox = this.container.bbox();
      this.offsetX = this.x - bbox.x;
      this.offsetY = this.y - bbox.y;
      this.offsetX2 = this.x + this.height + this.offsetX - bbox.x2;
      this.offsetY2 = this.y + this.width + this.offsetY - bbox.y2;
    } else {
      this.root.attr('style', 'border: 1px solid ' + this.borderColor + ';');
    }
    return (this.nested) ? [this.dragBox, this.border, this.resizeBox, this.borderShadow] : [];
  },
  onResize: function(width, height) {
    this.border.size(width, height);
    this.borderShadow.size(width, height);
    this.resizeBox.move(this.width-5, this.height-5);
  },
  onWidthChanged: function(width) {
    this.border.width(width);
    this.borderShadow.width(width);
    this.resizeBox.x(this.width-5);
  },
  onHeightChanged: function(height) {
    this.border.height(height);
    this.borderShadow.height(height);
    this.resizeBox.y(this.height-5);
  }
};