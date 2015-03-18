'use strict'

// A Block is an svg group that do any behavior, this can contain other Blocks or Workspaces
BB.Block = {
  constructor: function(name, options)  {
    BB.Object.call(this, 'Block');
    this.name = name;
    this.id = null;
    this.x = 0;
    this.y = 0;
    this.width = 20;
    this.height = 20;
    this.container = null; // contains attached elements(border) and SVG document
    this.childContainer = null; // svg group that contains all children
    this.statement = true;
    this.root = null;
    this.rootDark = null; //shadow effect
    this.nested = true; // Blocks are nested by default, allows toTopPropagate
    this.fields = [];
    this.attachDraggable = [];
    this.metrics = {
      borderRadius: 5,
      borderWidth: 1,
      initialSpace: {x: 4, y: 0},
      finalSpace: {x: 4, y: 4},
      fieldSpace: 5,
      rowSpace: 5, // same as borderRadius is recommended
      widthType: 'globalWidth',
    };
    if (!options) {
      return;
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
    if (options.metrics) {
      this.metrics = options.metrics;
    }
    if (options.render) {
      this.render();
    }
  },

  appendField: function(field) {
      this.fields.push(field);
  },

  newRow: function() {
      this.fields.push('newRow');
  },

  widthType: function(type) {
    if (type == 'grouped') {
      this.fields.push('groupedWidth');
    } else if (type == 'global') {
      this.fields.push('globalWidth');
    } else if (type == 'single') {
      this.fields.push('singleWidth');
    } else {
      throw 'Unknown width type';
    }
  },

  render: function() {
    if (!this.workspace) {
      throw 'Blocks must have a workspace to be rendered';
      return;
    }
    if (!this.rendered) {
      this.init(); // attributes of Block
      //needs create container before initSVG, because it render the fields
      this.container = this.workspace.root.group();
      this.container.move(this.x, this.y);
      this.initSvg(); // compute graphics for rendering
      if (!this.colorPalette) {
        this.colorPalette = BB.colorPalettes.block.light; //default palette
      }
      // styling
      this.bgColor = this.colorPalette.background;
      this.shadowColor = this.colorPalette.shadowColor;
      this.lightColor = this.colorPalette.lightColor;
      this.borderColor = this.colorPalette.border;
      if (this.stylingFunction) {
        this.stylingFunction();
      }
      //render block - render fields and all block svg
      this.renderBlock_();
      // render children
      this.childContainer = this.workspace.root.group(); 
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].render();
        this.childContainer.add(this.children[i].container);
      }
      this.container.add(this.rootDark);
      this.container.add(this.rootLight);
      this.container.add(this.root);
      this.container.add(this.childContainer);
      // add fields to top of container
      for (var i = 0; i < this.fields.length; i++) {
        if (typeof(this.fields[i]) == 'object') {
          this.fields[i].toTop();
        }
      }
      this.attachDraggable.push(this.rootDark);
      this.attachDraggable.push(this.rootLight);
      this.attachDraggable.push(this.root);
      this.container.draggable(this, null, this.attachDraggable);
      var el = this; //for the next closure
      this.container.dragstart = function() {
        el.toTopPropagate(); //focus workspace
      };
      this.workspace.childContainer.add(this.container);
      this.workspace.childRendered(this);
      if (this.attach) {
        this.attach(); // attach additional svg elements to block
      }
      this.rendered = true;
    }
  },

  attachEvents: function(child) {
    this.attachDraggable.push(child);
    this.container.draggable(this.workspace, null, this.attachDraggable);
  },

  // calculate metrics
  initSvg: function() {
    var globalWidth = this.metrics.initialSpace.x, box, maxHeight = 0;
    var metrics = {
      width: this.metrics.initialSpace.x,
      y: this.metrics.initialSpace.y
    };
    this.metrics.rows = [];
    for (var i = 0; i < this.fields.length; i++) {
      if (typeof(this.fields[i]) == 'string') { //field control commands
        switch (this.fields[i]) {
            case 'newRow':
              metrics.y += maxHeight + this.metrics.rowSpace + this.metrics.initialSpace.y;
              metrics.width  += this.metrics.finalSpace.x - this.metrics.fieldSpace;
              this.metrics.rows.push({width: metrics.width,
                                      y: metrics.y,
                                      height: maxHeight,
                                      widthType: this.metrics.widthType
                                     });
              globalWidth = Math.max(metrics.width, globalWidth);
              metrics.width = this.metrics.initialSpace.x;
              maxHeight = 0;
              break;
            case 'globalWidth':
              this.metrics.widthType = 'globalWidth';
              break;
            case 'groupedWidth':
              this.metrics.widthType = 'groupedWidth';
              break;
            case 'singleWidth':
              this.metrics.widthType = 'singleWidth';
              break;
            default:
            throw 'Unknown width type';
        }
      } else {
        this.fields[i].render();
        box = this.fields[i].root.bbox();
        this.fields[i].root.move(metrics.width, metrics.y); // position of field
        metrics.width += box.width + this.metrics.fieldSpace;
        maxHeight = Math.max(maxHeight, box.height);
      }
    }
    metrics.width += this.metrics.finalSpace.x - this.metrics.fieldSpace;
    globalWidth = Math.max(metrics.width, globalWidth);
    metrics.y += box.height + this.metrics.finalSpace.y;
    this.metrics.rows.push({
      width: metrics.width,
      y: metrics.y,
      height: maxHeight,
      widthType: this.metrics.widthType
    });
    this.width = globalWidth;
    this.height = metrics.y;
    // compute widths
    var i, j, groupFound = false, maxWidth;
    for (i = 0; i < this.metrics.rows.length; i++) {
      if (this.metrics.rows[i].widthType == 'groupedWidth') {
        if (groupFound == false) {
          maxWidth = this.metrics.rows[i].width;
          for (j=i+1;j<this.metrics.rows.length && this.metrics.rows[j].widthType=='groupedWidth'; j++) {
            maxWidth = Math.max(maxWidth, this.metrics.rows[j].width);
          }
          groupFound = true;
        }
        this.metrics.rows[i].width = maxWidth; //uniforms width
      } else {
         if (this.metrics.rows[i].widthType == 'globalWidth') {
           this.metrics.rows[i].width = this.width; //global width
         }
         groupFound = false;
      }
    }
    // compute heights
    var height, lastWidth = this.metrics.rows[0].width;
    this.metrics.rows[0].lastRadius = 'plane';
    for (i = 1; i < this.metrics.rows.length; i++) {
      height = this.metrics.rows[i].height;
      if (lastWidth < this.metrics.rows[i].width) {
        this.metrics.rows[i].lastRadius = 'convex';
        this.metrics.rows[i-1].nextRadius = 'concave';
      }else if (lastWidth > this.metrics.rows[i].width) {
        this.metrics.rows[i].lastRadius = 'concave';
        this.metrics.rows[i-1].nextRadius = 'convex';
      } else {
        this.metrics.rows[i].lastRadius = 'plane';
        this.metrics.rows[i-1].nextRadius = 'plane';
      }
      lastWidth = this.metrics.rows[i].width;
    }
    this.metrics.rows[this.metrics.rows.length-1].nextRadius = 'convex';
  },

  renderBlock_: function() {
    var radius = this.metrics.borderRadius; // for typing
    var rowSpace = this.metrics.rowSpace; // for typing
    this.root = this.workspace.root.path().M({x: radius, y: this.height})
                .q({x: -radius, y: 0}, {x: -radius, y: -radius})
                .v(-this.height + 2*radius) // left side
                .q({x: 0, y: -radius}, {x: radius, y: -radius});
    // top
    var row = this.metrics.rows[0]; //for typing
    var height = row.y;
    height -= radius;
    //first row
    this.root.H(row.width - radius)
              .q({x: radius, y: 0}, {x: radius, y: radius})
              .V(height);
    //render by row rigth line - middle
    for (var i = 1; i < this.metrics.rows.length - 1 ; i++) {
      row = this.metrics.rows[i];
      height = row.y;
      height -= radius;
      if (row.lastRadius == 'convex') {
        this.root.q({x: 0, y: radius}, {x: radius, y: radius})
                 .H(row.width - radius)
                 .q({x: radius, y: 0}, {x: radius, y: radius})
                 .V(height);
      } else if (row.lastRadius == 'concave') {
        this.root.q({x: 0, y: radius}, {x: -radius, y: radius})
                 .H(row.width + radius)
                 .q({x: -radius, y: 0}, {x: -radius, y: radius})
                 .V(height);
      } else if (row.lastRadius == 'plane') {
        this.root.V(height);
      } else {
        throw 'Unsopported type of radius: ' + row.lastRadius;
      }
    }
    //last row
    row = this.metrics.rows[this.metrics.rows.length-1];
    if (row.lastRadius == 'plane') {
      this.root.V(row.y - radius);
    } else {
      this.root.q({x: 0, y: radius}, {x: radius, y: radius})
                .H(row.width - radius)
                .q({x: radius, y: 0}, {x: radius, y: radius})
                .V(row.y - radius);
    }
    var finalRow = this.metrics.rows[this.metrics.rows.length - 1]; //for typing
    var finalWidth = finalRow.width;
    // bottom line
    this.root.q({x: 0, y: radius}, {x: -radius, y: radius})
             .h(-finalWidth + 2*radius)
             // TODO: report border bug in svg, when drag a block with black border, this proyest dont use that, use svg rect
             /*.stroke({ color: this.borderColor,
                       opacity: 1,
                       width: this.metrics.borderWidth
              }).fill(this.bgColor);*/
    this.root.fill(this.bgColor);
    this.rootDark = this.root.clone();
    this.rootDark.fill(this.shadowColor);
    this.rootDark.dmove(1,1);
    this.rootLight = this.root.clone();
    this.rootLight.fill(this.lightColor);
    this.rootLight.dmove(-1,-1);
  }
};

BB.Block = BB.Object.prototype.create(BB.Block); // Obj.js first level class