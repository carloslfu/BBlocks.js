'use strict'

// A basic workspace implementation that shows how create workspaces, this is instantiable.
BB.WorkspaceBasic = {
  init: function() {
    // render aditional elements
    this.borderColor = this.colorPalette.border[this.nested ? 'nested' : 'main'];
    if (this.nested) {
      this.dragBoxColor = this.colorPalette.dragBoxColor;
      this.resizeBoxColor = this.colorPalette.resizeBoxColor;
      this.dragBox = this.workspace.root.rect(200, 30)
                         .stroke({ color: '#000', opacity: 0.4, width: 2 })
                         .fill(this.borderColor).radius(1).move(-5, -25);
      this.titleRoot = this.workspace.root.text(this.title).font({size: 20}).fill('#fff').move(0, -25);
      this.resizeButton = this.workspace.root.image(this.imageArrowBase64)
                            .opacity(1)
                            .size(20, 20).move(170, -20);
      this.resizeBox = this.workspace.root.rect(10, 10)
                         .stroke({ color: this.borderColor, opacity: 1, width: 1 })
                         .fill(this.resizeBoxColor).radius(1).move(this.width-5, this.height-5).rotate(45);
      this.resizeArrows = this.workspace.root.image(this.imageArrowBase64)
                            .opacity(0.5)
                            .size(50, 50).move(this.width-25, this.height-25);
      this.borderShadow = this.workspace.root.rect(this.width, this.height).fill('none').radius(5);
      this.border = this.workspace.root.rect(this.width, this.height)
                      .stroke({ color: this.borderColor, opacity: 1, width: 4 }).fill('none').radius(5);
      this.hideResizeControls();
      this.container.add(this.borderShadow);
      this.container.add(this.border);
      this.container.add(this.dragBox);
      this.container.add(this.titleRoot);
      this.container.add(this.resizeButton);
      this.container.add(this.resizeBox);
      this.container.add(this.resizeArrows);
      this.borderShadow.addClass(this.style.className);
      var this_ = this;
      PolymerGestures.addEventListener(this.resizeButton.node, 'down', function(e) {
        if (this_.resizeControls_) {
          this_.hideResizeControls();
        } else {
          this_.showResizeControls();
        }
        e.preventDefault();
        e.stopPropagation();
      });
      this.container.draggable(this, null, [this.dragBox, this.titleRoot, this.border, this.borderShadow]);
      this.container.resizable(this, null, [this.resizeBox, this.resizeArrows]);
      var bbox = this.container.bbox();
      this.offsetX = this.x - bbox.x;
      this.offsetY = this.y - bbox.y;
      this.offsetX2 = this.x + this.height + this.offsetX - bbox.x2;
      this.offsetY2 = this.y + this.width + this.offsetY - bbox.y2;
    } else {
      this.root.attr('style', 'border: 1px solid ' + this.borderColor + ';');
    }
    return (this.nested) ? [this.dragBox, this.titleRoot, this.resizeButton, this.border, this.resizeBox, this.resizeArrows, this.borderShadow] : [];
  },

  showResizeControls: function() {
    this.resizeBox.show();
    this.resizeArrows.show();
    this.resizeControls_ = true;
  },
  hideResizeControls: function() {
    this.resizeBox.hide();
    this.resizeArrows.hide();
    this.resizeControls_ = false;
  },

  onBlur: function() {
    this.hideResizeControls();
  },
  onResize: function(width, height) {
    this.border.size(width, height);
    this.borderShadow.size(width, height);
    if (this.resizeControls_) {
      this.resizeBox.rotate(0).move(this.width-5, this.height-5).rotate(45);
      this.resizeArrows.move(this.width-5, this.height-25);
    }
  },
  onWidthChanged: function(width) {
    this.border.width(width);
    this.borderShadow.width(width);
    if (this.resizeControls_) {
      this.resizeBox.rotate(0).x(this.width-5).rotate(45);
      this.resizeArrows.x(this.width-25);
    }
  },
  onHeightChanged: function(height) {
    this.border.height(height);
    this.borderShadow.height(height);
    if (this.resizeControls_) {
      this.resizeBox.rotate(0).y(this.height-5).rotate(45);
      this.resizeArrows.y(this.height-25);
    }
  },
  imageArrowBase64: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDIzLjY1IDIzLjY1IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyMy42NSAyMy42NTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwYXRoIHN0eWxlPSJmaWxsOiMwMzAxMDQ7IiBkPSJNMC41ODcsMC4wNTdsNi41MjksMC42MjFjMCwwLDAuODY5LTAuMDI3LDAuMzgzLDAuNDU3QzcuMDExLDEuNjI0LDUuODMzLDIuODAxLDUuODMzLDIuODAxUzYuMTIsMy4wOSw2LjU2MywzLjUyNmMxLjI1NCwxLjI1OCwzLjUzOSwzLjU0Myw0LjQ2OSw0LjQ3M2MwLDAsMC4zMTgsMC4xODktMC4wNjQsMC41N2MtMC4zODMsMC4zODctMi4wNzIsMi4wNjgtMi4zNDYsMi4zNDRjLTAuMjY4LDAuMjczLTAuNDc1LDAuMDU3LTAuNDc1LDAuMDU3Yy0wLjkwNC0wLjkwNC0zLjI3LTMuMjY2LTQuNDg0LTQuNDgyQzMuMjcxLDYuMDkyLDMuMDE1LDUuODM1LDMuMDE1LDUuODM1UzIuMDY3LDYuNzgsMS40NzQsNy4zNzRjLTAuNTksMC41OTItMC41ODgtMC4yOTktMC41ODgtMC4yOTlTMC4wNjIsMS4yMjUsMC4wNjIsMC41MkMwLjA2MiwwLjAxNiwwLjU4NywwLjA1NywwLjU4NywwLjA1N3oiLz48cGF0aCBzdHlsZT0iZmlsbDojMDMwMTA0OyIgZD0iTTIzLjEyMiwyMy42MDhsLTYuNTIzLTAuNjIxYzAsMC0wLjg3MSwwLjAyNS0wLjM4Ny0wLjQ2MWMwLjQ4Ni0wLjQ4NCwxLjY2Ni0xLjY2NiwxLjY2Ni0xLjY2NnMtMC4yODctMC4yODUtMC43MjctMC43MjNjLTEuMjU2LTEuMjYtMy41NDEtMy41NDMtNC40NzEtNC40NzljMCwwLTAuMzIyLTAuMTgsMC4wNjItMC41NjRzMi4wNy0yLjA3LDIuMzQ2LTIuMzQ0YzAuMjcxLTAuMjc1LDAuNDc3LTAuMDU5LDAuNDc3LTAuMDU5YzAuOTAyLDAuOTA2LDMuMjcsMy4yNyw0LjQ4Miw0LjQ4MmMwLjM5MywwLjM5NSwwLjY1LDAuNjU0LDAuNjUsMC42NTRzMC45NDktMC45NDcsMS41NDEtMS41NDFjMC41OS0wLjU5MiwwLjU5LDAuMzAxLDAuNTksMC4zMDFzMC44MjIsNS44NTQsMC44MjIsNi41NDlDMjMuNjUxLDIzLjY0NywyMy4xMjIsMjMuNjA4LDIzLjEyMiwyMy42MDh6Ii8+PHBhdGggc3R5bGU9ImZpbGw6IzAzMDEwNDsiIGQ9Ik0wLjAwMSwyMy4wOTRsMC42MTUtNi41MzFjMCwwLTAuMDIzLTAuODY5LDAuNDY1LTAuMzgzYzAuNDg0LDAuNDg2LDEuNjY0LDEuNjY4LDEuNjY0LDEuNjY4UzMuMDMsMTcuNTYxLDMuNDcsMTcuMTJjMS4yNTYtMS4yNTYsMy41NDEtMy41NDEsNC40NzUtNC40NzVjMCwwLDAuMTg0LTAuMzE2LDAuNTY4LDAuMDY2YzAuMzgzLDAuMzg3LDIuMDcsMi4wNzIsMi4zNDQsMi4zNDZjMC4yNzMsMC4yNzEsMC4wNTUsMC40NzcsMC4wNTUsMC40NzdjLTAuOTA2LDAuOTA0LTMuMjY2LDMuMjctNC40OCw0LjQ4NmMtMC4zOTUsMC4zOTMtMC42NTIsMC42NDgtMC42NTIsMC42NDhzMC45NDUsMC45NDcsMS41MzcsMS41MzdjMC41OTIsMC41OTQtMC4yOTcsMC41OS0wLjI5NywwLjU5cy01Ljg1LDAuODI0LTYuNTUxLDAuODI0Qy0wLjA0MiwyMy42MiwwLjAwMSwyMy4wOTQsMC4wMDEsMjMuMDk0eiIvPjxwYXRoIHN0eWxlPSJmaWxsOiMwMzAxMDQ7IiBkPSJNMjMuNTUyLDAuNTU3bC0wLjYxNSw2LjUyOWMwLDAsMC4wMjMsMC44NjktMC40NjEsMC4zODNjLTAuNDktMC40OS0xLjY2OC0xLjY2NC0xLjY2OC0xLjY2NHMtMC4yODYsMC4yODYtMC43MjUsMC43MjVjLTEuMjU2LDEuMjU2LTMuNTQzLDMuNTQxLTQuNDc1LDQuNDczYzAsMC0wLjE4NCwwLjMxOC0wLjU2OC0wLjA2NnMtMi4wNjgtMi4wNjYtMi4zNDYtMi4zNGMtMC4yNy0wLjI3OS0wLjA1Ny0wLjQ4Mi0wLjA1Ny0wLjQ4MmMwLjkwNi0wLjkwNCwzLjI3LTMuMjY4LDQuNDg0LTQuNDhjMC4zOTYtMC4zOTUsMC42NS0wLjY1MiwwLjY1LTAuNjUycy0wLjk0My0wLjk0NS0xLjUzNy0xLjUzOWMtMC41OTItMC41OTIsMC4yOTktMC41ODYsMC4yOTktMC41ODZzNS44NDktMC44MjgsNi41NTItMC44MjhDMjMuNTk1LDAuMDMsMjMuNTUyLDAuNTU3LDIzLjU1MiwwLjU1N3oiLz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PC9zdmc+'
};