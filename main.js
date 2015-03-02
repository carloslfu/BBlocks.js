var mainWorkspace;
var main = function() {
	mainWorkspace = new BB.Workspace('main', 'mainWorkspaceDiv');
	mainWorkspace.render();
	mainWorkspace.add('Workspace', 'nested', {width : 300, height: 300});
	mainWorkspace.children[0].render();
	mainWorkspace.root.pannable();
}