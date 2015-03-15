var mainWorkspace, nested1, nested11, nested12, nested121, nested2, nested21, nested22, nested221, block1, block2; // global variables for debugging
var main = function() {
	mainWorkspace = new BB.Workspace('main', 'mainWorkspaceDiv');
	//BB.Workspace.prototype.colorPalette = BB.colorPalettes.workspace.dark;
	//BB.Block.prototype.colorPalette = BB.colorPalettes.block.dark;
	// alternate color palette for workspace backgrounds
	mainWorkspace.render();
	block1 = mainWorkspace.addBlock(new test_blocks.test('block1'));
	block1.render();
	block1.container.move(100, 100);
    block2 = mainWorkspace.addBlock(new example_blocks.example('block2'));
	block2.render();
	block2.container.move(50, 170);
};