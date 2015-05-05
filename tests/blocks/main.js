var mainWorkspace, nested1, nested11, nested12, nested121, nested2, nested21, nested22, nested221, block1, block2, block3, blockBlue; // global variables for debugging
var main = function() {
  mainWorkspace = new BB.Workspace('main', BB.WorkspaceBasic, 'mainWorkspaceDiv');
  //BB.Workspace.prototype.colorPalette = BB.colorPalettes.workspace.dark;
  //BB.Block.prototype.colorPalette = BB.colorPalettes.block.dark;
  mainWorkspace.render();
  block1 = mainWorkspace.addBlock('block1', test_blocks.test_dev);
  block1.render();
  block1.move(100, 100);
  block2 = mainWorkspace.addBlock('block2', example_blocks.example);
  block2.render();
  block2.move(50, 170);
  block3 = mainWorkspace.addBlock('block3', test_blocks.test);
  block3.render();
  block3.container.move(200, 270);
  blockBlue = mainWorkspace.addBlock('blockBlue', test_blocks.test);
  blockBlue.render();
  blockBlue.setColor('#2870b7');
  blockBlue.move(30, 20);
};