'use strict';

// Connection component (connections between components)

BB.Connection = ObjJS.prototype.create({
  constructor: function(name, workspace, options) {
    this.name = name;
    this.optionList = ['x',
                       'y',
                       'detectionRadius'];
    for (var i = 0,el; el = this.optionList[i]; i++) {
      if (options[el]) {
        this[el] = options[el];
      }
    }
    this.workspace = workspace;
  },

  closest: function() {
    if (!this.workspace) {
      throw "can't find the closest connection because don't have a workspace";
    }
    var blocks = this.workspace.getAllBlocks();
    var closestConnection = null, minDistance = -1, distance;
    for (var i = 0, numChildren = blocks.length; i < numChildren; i++) {
      for (var j = 0; connection = blocks[i].connections[j]; j++) {
        distance = this.computeDistance(this.x, this.y, connection.x, connection.y);
        if (this.detectionRadius > distance) {
          if (minDistance == -1 && minDistance > distance) {
            minDistance = distance;
            closestConnection = connection;
          }
        }
      }
    }
    return [closestConnection, minDistance];
  },

  computeDistance: function(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2), Math.pow(y1 - y2, 2));
  }
});