'use strict'

// custom block tests

var test_blocks = {};

// Block inerits from Object
test_blocks.test = function(id){
  BB.Block.call(this, "Block");
  this.id = id;
};

test_blocks.test.prototype = Object.create(BB.Block.prototype);

test_blocks.test.prototype.init = function(){
  //TODO: make the field prototype
  /*
  // fields can be anything :D (like the follow group)
  var group = this.workspace.root.group();
  var margin = this.workspace.root.rect(110, 110).fill('none');
  var rect = this.workspace.root.rect(100, 100).fill('#1d028e').dmove(6, 6);
  group.add(margin);
  group.add(rect);*/
  this.appendField(new BB.FieldText('hello! \n this is a text field', this));
};

test_blocks.test.attach = function(){
/*	this.text = this.container.text('print').font({
		  family:   "sans-serif"
		, size:     15}).move(4,0).fill('#fff');
	this.attachEvents(this.text);*/
};