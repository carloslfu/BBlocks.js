'use strict'

BB.Block = function(name, options, workspace) {
	this.name = name;
	if (!options) {
		return;
	}
	if (!workspace) {
		return;
	}
	this.workspace = workspace;
	this.parent = options.parent || null;
	if (options.render) {
		this.render();
	}
};

BB.Block.prototype.render = function() {
	this.path = this.workspace;
};