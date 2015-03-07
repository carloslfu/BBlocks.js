var mainWorkspace, nested1, nested11, nested12, nested121, nested2, nested21, nested22, nested221;
var main = function() {
	mainWorkspace = new BB.Workspace('main', 'mainWorkspaceDiv');
	nested1 = mainWorkspace.add('Workspace', 'nested1', {width : 300, height: 300, x: 10, y: 10});
	nested11 = nested1.add('Workspace', 'nested11', {width : 100, height: 100, x: 10, y: 10});
	nested12 = nested1.add('Workspace', 'nested12', {width : 100, height: 100, x: 20, y: 20});
	nested121 = nested12.add('Workspace', 'nested121', {width : 30, height: 30, x: 10, y: 10});
	nested2 = mainWorkspace.add('Workspace', 'nested2', {width : 300, height: 300, x: 350, y: 50});
	nested21 = nested2.add('Workspace', 'nested21', {width : 100, height: 100, x: 10, y: 10});
	nested22 = nested2.add('Workspace', 'nested22', {width : 100, height: 100, x: 20, y: 20});
	nested221 = nested22.add('Workspace', 'nested221', {width : 30, height: 30, x: 10, y: 10});
	BB.Workspace.prototype.paletteColors.background.main = '#FFFFFF';
	BB.Workspace.prototype.paletteColors.background.nested = '#EDEEEA';
	BB.Workspace.prototype.paletteColors.border.nested = '#2B95FF';
	// alternate palette colors for workspace backgrounds
	BB.Workspace.prototype.stylingFunction = function() {
		this.bgColor = this.paletteColors.background[(this.level % 2 == 1) ? 'nested' : 'main'];
	};
	mainWorkspace.render();
};