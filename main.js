var mainWorkspace;
var main = function() {
	mainWorkspace = new BB.Workspace('main', 'mainWorkspaceDiv');
	mainWorkspace.render();
	var nested1 = mainWorkspace.add('Workspace', 'nested1', {width : 300, height: 300});
	nested1.render();
	var nested11 = nested1.add('Workspace', 'nested11', {width : 100, height: 100});
	nested11.render();
	var nested12 = nested1.add('Workspace', 'nested12', {width : 100, height: 100});
	nested12.render();
	var nested111 = nested11.add('Workspace', 'nested111', {width : 30, height: 30});
	nested111.render();
	var nested2 = mainWorkspace.add('Workspace', 'nested2', {width : 300, height: 300, x: 350, y: 50});
	nested2.render();
	var nested21 = nested2.add('Workspace', 'nested21', {width : 100, height: 100});
	nested21.render();
	var nested22 = nested2.add('Workspace', 'nested22', {width : 100, height: 100});
	nested22.render();
	var nested211 = nested21.add('Workspace', 'nested211', {width : 30, height: 30});
	nested211.render();
}