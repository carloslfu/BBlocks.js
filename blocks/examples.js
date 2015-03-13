'use strict'


// custom block tests

var example_blocks = {};

// Block inerits from Object
example_blocks.test = function(id){
  BB.Block.call(this, "Block");
  this.id = id;
};

example_blocks.test.prototype = Object.create(BB.Block.prototype);

example_blocks.test.prototype.init = function(){
  //TODO: make the field prototype
  var textFields = [];
  textFields[1] = this.workspace.root.text('print').font({
    family:   "sans-serif"
    , size:     15}).fill('#fff');
  textFields[2] = this.workspace.root.text('print').font({
    family:   "sans-serif"
    , size:     15}).fill('#282ed9');
  textFields[3] = textFields[1].clone();
  textFields[4] = textFields[2].clone();
  textFields[5] = textFields[1].clone();
  textFields[6] = textFields[2].clone();
  textFields[7] = textFields[1].clone();
  textFields[8] = textFields[2].clone();
  textFields[0] = textFields[2].clone();
  for (var i = 0; i < textFields.length ; i++) {
    this.attachDraggable.push(textFields[i]);
  }
  // fields can be anything :D (like the follow group)
  var group = this.workspace.root.group();
  var margin = this.workspace.root.rect(110, 110).fill('none');
  var rect = this.workspace.root.rect(100, 100).fill('#1d028e').dmove(6, 6);
  group.add(margin);
  group.add(rect);
  this.widthType('grouped');
  this.appendField(textFields[1]);
  this.newRow();
  this.appendField(textFields[2]);
  this.appendField(textFields[3]);
  this.newRow();
  this.appendField(textFields[4]);
  this.newRow();
  this.appendField(textFields[5]);
  this.appendField(textFields[6]);
  this.appendField(textFields[7]);
  this.newRow();
  this.widthType('single');
  this.appendField(textFields[8]);
  this.newRow();
  this.appendField(textFields[0]);
  this.appendField(group);
};

test_blocks.test.attach = function(){
/*	this.text = this.container.text('print').font({
		  family:   "sans-serif"
		, size:     15}).move(4,0).fill('#fff');
	this.attachEvents(this.text);*/
};