'use strict'

// custom block tests

var example_blocks = {};

// Block inerits from Object
example_blocks.example = {
  //DOCS: init options are the customOptions passed in a block constructor
  init: function(options){
    if (!options) {
      options = {};
    }
    // this example shows the row system
    this.widthType('grouped');
    this.appendField(new BB.FieldText('hello! \n this is a text field', this));
    this.newRow();
    this.appendField(new BB.FieldText('text', this));
    this.appendField(new BB.FieldText('text', this));
    this.appendField(new BB.FieldButton('Button', this, options.ondown));
    this.newRow();
    this.appendField(new BB.FieldText('text', this));
    this.newRow();
    this.widthType('single');
    this.appendField(new BB.FieldText('text', this));
    this.appendField(new BB.FieldText('text', this));
    this.appendField(new BB.FieldText('text', this));
    this.newRow();
    this.appendField(new BB.FieldText('text', this, {fontColor: '#173aff'}));
    this.newRow();
    this.appendField(new BB.FieldText('text', this, {fontColor: '#ff9417'}));
    this.newRow();
    this.widthType('global');
    this.appendField(new BB.FieldText('text', this));
    this.appendField(new BB.FieldText('text', this));
    this.appendField(new BB.FieldText('text', this));
    this.newRow();
    this.appendField(new BB.FieldText('text', this));
    this.newRow();
    this.appendField(new BB.FieldText('text', this));
  },
  /*attach: function(){
	this.text = this.container.text('print').font({
      family:   "sans-serif",
      size:     15}).move(4,0).fill('#fff');
	this.attachEvents(this.text);
  }*/
};