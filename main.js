var mainWorkspace, nested1, nested11, nested12, nested121, nested2, nested21, nested22, nested221, block1, block2, block3, block4;
var main = function() {
	mainWorkspace = new BB.Workspace('main', 'mainWorkspaceDiv');
	nested1 = mainWorkspace.addWorkspace('nested1', {width : 300, height: 300, x: 10, y: 10});
	nested11 = nested1.addWorkspace('nested11', {width : 100, height: 100, x: 10, y: 10});
	nested12 = nested1.addWorkspace('nested12', {width : 100, height: 100, x: 20, y: 20});
	nested121 = nested12.addWorkspace('nested121', {width : 30, height: 30, x: 10, y: 10});
	nested2 = mainWorkspace.addWorkspace('nested2', {width : 300, height: 300, x: 350, y: 50});
	nested21 = nested2.addWorkspace('nested21', {width : 100, height: 100, x: 10, y: 10});
	nested22 = nested2.addWorkspace('nested22', {width : 100, height: 100, x: 20, y: 20});
	nested221 = nested22.addWorkspace('nested221', {width : 30, height: 30, x: 10, y: 10});

	//BB.Workspace.prototype.colorPalette = BB.colorPalettes.workspace.dark;
	//BB.Block.prototype.colorPalette = BB.colorPalettes.block.dark;
	// alternate color palette for workspace backgrounds
	BB.Workspace.prototype.stylingFunction = function() {
		this.bgColor = this.colorPalette.background[(this.level % 2 == 1) ? 'nested' : 'main'];
	};
	mainWorkspace.render();
    block1 = mainWorkspace.addBlock(new test_blocks.test('block1'));
	block1.render();
	block1.container.move(100, 100);
    block2 = mainWorkspace.addBlock(new example_blocks.example('block2'));
	block2.render();
	block2.container.move(50, 170);
    block3 = nested2.addBlock(new test_blocks.test('block1'));
	block3.render();
	block3.container.move(100, 100);
    block4 = nested2.addBlock(new example_blocks.example('block2'));
	block4.render();
	block4.container.move(50, 170);
};