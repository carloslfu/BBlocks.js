var mainWorkspace, nested1, nested11, nested12, nested121, nested2, nested21, nested22, nested221, block1, block2, block3, block4;
var main = function() {
  mainWorkspace = new BB.Workspace('main', BB.WorkspaceBasic, 'mainWorkspaceDiv');
  nested1 = mainWorkspace.addWorkspace('nested1', BB.WorkspaceBasic, {width : 300, height: 300, x: 10, y: 10});
  nested11 = nested1.addWorkspace('nested11', BB.WorkspaceBasic, {width : 100, height: 100, x: 10, y: 10});
  nested12 = nested1.addWorkspace('nested12', BB.WorkspaceBasic, {width : 100, height: 100, x: 20, y: 20});
  nested121 = nested12.addWorkspace('nested121', BB.WorkspaceBasic, {width : 30, height: 30, x: 10, y: 10});
  nested2 = mainWorkspace.addWorkspace('nested2', BB.WorkspaceBasic, {width : 300, height: 300});
  nested21 = nested2.addWorkspace('nested21', BB.WorkspaceBasic, {width : 100, height: 100, x: 10, y: 10});
  nested22 = nested2.addWorkspace('nested22', BB.WorkspaceBasic, {width : 100, height: 100, x: 20, y: 20});
  nested221 = nested22.addWorkspace('nested221', BB.WorkspaceBasic, {width : 30, height: 30, x: 10, y: 10});
  nested2211 = nested221.addWorkspace('nested2211', BB.WorkspaceBasic, {width : 30, height: 30, x: 10, y: 10});
  nested22111 = nested2211.addWorkspace('nested22111', BB.WorkspaceBasic, {width : 30, height: 30, x: 10, y: 10});
  //BB.Workspace.prototype.colorPalette = BB.colorPalettes.workspace.dark;
  //BB.Block.prototype.colorPalette = BB.colorPalettes.block.dark;
  // alternate color palette for workspace backgrounds
  BB.Workspace.prototype.stylingFunction = function() {
    this.bgColor = this.colorPalette.background[(this.level % 2 == 1) ? 'nested' : 'main'];
    this.background.fill(this.bgColor);
  };
  mainWorkspace.render();
  block1 = mainWorkspace.addBlock('block1', test_blocks.test_dev);
  block1.render();
  block1.move(100, 100);
  block2 = mainWorkspace.addBlock('block2', example_blocks.example);
  block2.render();
  block2.move(50, 170);
  block3 = nested2.addBlock('block3', test_blocks.test);
  block3.render();
  block3.move(100, 100);
  block6 = mainWorkspace.addBlock('blockBlue', test_blocks.test);
  block6.render();
  block6.setColor('#2870b7');
  block6.move(30, 20);
  nested2.move(350,50);
  block4 = nested2.addBlock('block4', example_blocks.example);
  block4.render();
  nested2.rotate(0);
  nested2.rotate(45);
  block4.move(50, 170);
  //field button fires animation
  block2.fields[5].ondown = block1.methods.animation;
  block1.methods.animationStart = function () {
    block2.fields[5].ondown = null;
  }
  block1.methods.animationEnd = function () {
    block2.fields[5].ondown = block1.methods.animation;
  }
  
  // nesting blocks performance test
  for (var i = 1; i < 0; i++) {
  //  nested2211.addBlock('block' + i, example_blocks.example).render();
  }
};

