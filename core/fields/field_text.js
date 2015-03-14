'use strict'

// Field text
BB.FieldText = function(text, parent, options)  {
  BB.Field.call(this, 'Text');
  this.children = [];
  this.container = null; // contains attached elements(border) and SVG document
  this.childContainer = null; // svg group that contains all children
  this.root = null;
  this.fontFamily = 'sans-serif';
  this.fontColor = '#fff';
  this.size = 15; // px default metrics in svg.js library
  if (text) {
  	this.text = text;
  }
  if (parent) {
    this.parent = parent;
  }
  if (!options) {
  	return;
  }
  if (options.fontColor) {
    this.fontColor = options.fontColor;
  }
  if (options.fontFamily) {
  	this.fontFamily = options.fontFamily;
  }
  if (options.fontSize) {
  	this.fontSize = options.fontSize;
  }
  if (options.render) {
  	this.render();
  }
};

// FieldText inherits from Field
BB.FieldText.prototype = Object.create(BB.Field.prototype);

BB.FieldText.prototype.render = function(){
  if (!this.parent) {
    throw 'FieldText must have a parent to be rendered';
    return;
  }
  if (!this.rendered) {
    this.root = this.parent.container.text(this.text).font({
      family: this.fontFamily
      , size: this.fontSize}).fill(this.fontColor);
  }
  if (this.parent.attachDraggable) {
    this.parent.attachDraggable.push(this.root); // This text can drag all parent
  }
};