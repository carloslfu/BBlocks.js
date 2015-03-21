'use strict'

// custom block tests

var test_blocks = {};

test_blocks.test = {
  init: function(){
    this.id = 0;
    this.appendField(new BB.FieldText('hello! \n this is a text field', this));
  },
  attach: function(){
    this.rotate(45);
  }
};

// test_dev block for debugging fields
test_blocks.test_dev = {
  init: function(){
    // fields can be anything :D (like the follow group)
    /*
    var group = this.workspace.root.group();
    var margin = this.workspace.root.rect(110, 110).fill('none');
    var rect = this.workspace.root.rect(100, 100).fill('#1d028e').dmove(6, 6);
    group.add(margin);
    group.add(rect);*/
    //this.appendField(new BB.FieldText('hello! \n this is a text field', this));
    //this.appendField(new BB.FieldSvg(group, this));
    var group2 = this.workspace.root.group();
    var margin2 = this.workspace.root.rect(110, 110).fill('none');
    var rect2 = this.workspace.root.rect(100, 100).fill('#1d028e').dmove(6, 6);
    group2.add(margin2);
    group2.add(rect2);
    this.appendField(new BB.FieldText('Click or touch\nthe blue rect', this));
    this.appendField(new BB.FieldSvg(group2, this));
  },
  attach: function(){
    //this.rotate(45);
    var this_ = this;
    // TODO: allows animate rotation
    var animation = function(){
      PolymerGestures.removeEventListener(this_.fields[1].root.node, 'down', animation);
      this_.animate(1000).rotate(15).scale(1.2);
      setTimeout(function(){
        this_.animate(1000).rotate(0).scale(1);
        setTimeout(function(){
          PolymerGestures.addEventListener(this_.fields[1].root.node, 'down', animation);
        }, 1000);
      },1000);
    }
    PolymerGestures.addEventListener(this.fields[1].root.node, 'down', animation);
  }
};