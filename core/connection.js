'use strict';

// Connection component (connections between components)

BB.Connection = ObjJS.prototype.create({
  constructor: function(name, parent, options) {
    this.name = name;
    this.index_ = null; // index of the connection in it parent
    this.optionList = ['x', // this position is relative to the parent
                       'y',
                       'detectionRadius'];
    for (var i = 0,el; el = this.optionList[i]; i++) {
      if (options.hasOwnProperty(el)) {
        this[el] = options[el];
      }
    }
    this.parent = parent;
  },
  getAbsoluteXY: function() {
    var absParentPosition = this.parent.getAbsoluteXY();
    return {x: absParentPosition.x + this.x, y: absParentPosition.y + this.y};
  },

  closest: function() {
    if (!this.parent) {
      throw "can't find the closest connection because don't have a parent";
    }
    if (!this.parent.workspace) {
      throw "can't find the closest connection because parent don't have a workspace";
    }
    var blocks = this.parent.workspace.getAllBlocks([this.parent]); // all blocks except the parent block
    var closestConnection = null, minDistance = -1, distance;
    var absPos = this.getAbsoluteXY(), absPosConn;
    for (var i = 0, numChildren = blocks.length; i < numChildren; i++) {
      for (var j = 0, connection; connection = blocks[i].connections[j]; j++) {
        absPosConn = connection.getAbsoluteXY();
        distance = this.computeDistance(absPos.x, absPos.y, absPosConn.x, absPosConn.y);
        if (this.detectionRadius > distance) {
          if (minDistance == -1 || minDistance > distance) {
            minDistance = distance;
            closestConnection = connection;
          }
        }
      }
    }
    return [closestConnection, minDistance];
  },

  computeDistance: function(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }
});