var mainWorkspace, nested1, nested11, nested12, nested121, nested2, nested21, nested22, nested221, block1, block2, block3; // global variables for debugging
var main = function() {
	mainWorkspace = new BB.Workspace('main', 'mainWorkspaceDiv');
	//BB.Workspace.prototype.colorPalette = BB.colorPalettes.workspace.dark;
	//BB.Block.prototype.colorPalette = BB.colorPalettes.block.dark;
	// alternate color palette for workspace backgrounds
	mainWorkspace.render();
    block1 = mainWorkspace.addBlock('block1', test_blocks.test_dev);
	block1.render();
	block1.container.move(100, 100);
    block2 = mainWorkspace.addBlock('block2', example_blocks.example);
	block2.render();
	block2.container.move(50, 170);
    block3 = mainWorkspace.addBlock('block3', test_blocks.test);
	block3.render();
	//block3.container.move(200, 270); //TODO: implement move of Objects
};