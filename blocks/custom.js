'use strict'

// custom block tests

var test_blocks = {};

test_blocks.test = {
  init: function() {
    this.id = 0;
    this.appendField(new BB.FieldText('hello! \n this is a text field', this));
  },
  attach: function() {
    //this.rotate(45); // rotate have a bug, this is temporaly disabled for demos
  }
};

//Task block
test_blocks.task = {
  init: function() {
    this.id = 0;
    this.appendField(new BB.FieldText('Stack me! please :)', this));
    this.setTopConnection(true);
    this.setBottomConnection(true);
  }
};

// test_dev block for debugging fields
test_blocks.test_dev = {
  init: function() {
    // fields can be anything :D (like the follow group)
    var group2 = this.workspace.root.group();
    var margin2 = this.workspace.root.rect(110, 110).fill('none');
    var rect2 = this.workspace.root.rect(100, 100).fill('#1d028e').dmove(6, 6);
    group2.add(margin2);
    group2.add(rect2);
    this.appendField(new BB.FieldText('Click or touch\nthe blue rect', this));
    this.appendField(new BB.FieldSvg(group2, this));
  },
  attach: function() {
    //this.rotate(45);
    var this_ = this;
    // TODO: allows animate rotation
    this.methods.animation = function() {
      // start animation
      if (this_.methods.animationStart)
        this_.methods.animationStart();
      PolymerGestures.removeEventListener(this_.fields[1].container.node, 'down', this_.methods.animation);
      this_.animate(1000).rotate(15).scale(1.2);
      setTimeout(function() {
        this_.animate(1000).rotate(0).scale(1);
        setTimeout(function() {
          //finalize animation
          PolymerGestures.addEventListener(this_.fields[1].container.node, 'down', this_.methods.animation);
          if (this_.methods.animationEnd)
            this_.methods.animationEnd();
        }, 1000);
      },1000);
    }
    PolymerGestures.addEventListener(this.fields[1].container.node, 'down', this_.methods.animation);
  },
  //DOCS: Best practice is put custom block methods in methods namespace
  methods: {
    animation: null,
    animationStart: null,
    animationEnd: null
  }
};
