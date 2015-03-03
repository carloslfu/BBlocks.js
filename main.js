var mainWorkspace;
var main = function() {
	mainWorkspace = new BB.Workspace('main', 'mainWorkspaceDiv');
	mainWorkspace.render();
	var nested1 = mainWorkspace.add('Workspace', 'nested1', {width : 300, height: 300});
	nested1.render();
	var nested11 = nested1.add('Workspace', 'nested11', {width : 30, height: 30});
	nested11.render();
	var nested2 = mainWorkspace.add('Workspace', 'nested2', {width : 300, height: 300, x: 50, y: 200});
	nested2.render();
}