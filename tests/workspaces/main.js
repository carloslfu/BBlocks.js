var mainWorkspace, nested1, nested11, nested12, nested121, nested2, nested21, nested22, nested221, block1;
var main = function() {
  mainWorkspace = new BB.Workspace('main', BB.WorkspaceBasic, 'mainWorkspaceDiv');
  nested1 = mainWorkspace.addWorkspace('nested1', BB.WorkspaceBasic, {width : 300, height: 300, x: 10, y: 10});
  nested11 = nested1.addWorkspace('nested11', BB.WorkspaceBasic, {width : 100, height: 100, x: 10, y: 10});
  nested12 = nested1.addWorkspace('nested12', BB.WorkspaceBasic, {width : 100, height: 100, x: 20, y: 20});
  nested121 = nested12.addWorkspace('nested121', BB.WorkspaceBasic, {width : 30, height: 30, x: 10, y: 10});
  nested2 = mainWorkspace.addWorkspace('nested2', BB.WorkspaceBasic, {width : 300, height: 300, x: 350, y: 50});
  nested21 = nested2.addWorkspace('nested21', BB.WorkspaceBasic, {width : 100, height: 100, x: 10, y: 10});
  nested22 = nested2.addWorkspace('nested22', BB.WorkspaceBasic, {width : 100, height: 100, x: 20, y: 20});
  nested221 = nested22.addWorkspace('nested221', BB.WorkspaceBasic, {width : 30, height: 30, x: 10, y: 10});

//BB.Workspace.prototype.colorPalette = BB.colorPalettes.workspace.dark;
//BB.Block.prototype.colorPalette = BB.colorPalettes.block.dark;
// alternate color palette for workspace backgrounds
  BB.Workspace.prototype.stylingFunction = function() {
    this.bgColor = this.colorPalette.background[(this.level % 2 == 1) ? 'nested' : 'main'];
    this.background.fill(this.bgColor);
  };
  mainWorkspace.render();
  nested2.rotate(45);
};