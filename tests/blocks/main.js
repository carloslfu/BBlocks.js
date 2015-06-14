'use strict';

// global variables for debugging
var mainWorkspace, nested1, nested11, nested12, nested121, nested2, nested21, nested22, nested221, block1, block2, block3, blockBlue; 
var seqContainer1, seqBlock1, seqBlock2, seqBlock3;

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
  block3.move(200, 270);
  blockBlue = mainWorkspace.addBlock('blockBlue', test_blocks.test);
  blockBlue.render();
  blockBlue.setColor('#2870b7');
  blockBlue.move(30, 20);
  // test block sequence container
  seqBlock1 = mainWorkspace.addBlock('seqBlock1', test_blocks.test);
  seqBlock1.render();
  seqBlock1.move(350, 50);
  seqBlock2 = mainWorkspace.addBlock('seqBlock2', test_blocks.test);
  seqBlock2.render();
  seqBlock3 = mainWorkspace.addBlock('seqBlock3', test_blocks.test);
  seqBlock3.render();
  seqContainer1 = new BB.BlockSequence('seqContainer1', mainWorkspace);
  mainWorkspace.children.push(seqContainer1);
  seqContainer1.addBlock(seqBlock1);
};