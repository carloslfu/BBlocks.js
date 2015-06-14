# BBlocks.js documentation

This page contains the documentation of the project. All of this content should be merged in the project wiki. This docs are in construction ...

## Performance

Some recomendations for GUI performance:

- Avoid use workspaces largely, the `ovewflow: hidden` property used for workspaces has a direct impact on performance.
- Avoid excesive nesting.
- Make your interface as simple as possible.
- Avoid keep excesive nodes in the GUI at same time.
- Test your GUI in mobile devices, the performace is critic for those.

## Cross browser

I test this project for Chrome and Firefox browsers but the goal is supports all modern browsers if possible.

Avoid use foreign objects that contains text for selection and text inputs (this is largely bugged in all rendering engines).

### Firefox

Avoid use rotations when the object have text because Firefox renders it bad (see [rotated text bug][rotated-text-firefox-bug]).
[rotated-text-firefox-bug]: https://bugzilla.mozilla.org/show_bug.cgi?id=1156827

### Chrome

Avoid use a fluid text scaling beacause it is rendered bad (TODO: report this bug).

## Develop

### Coding

This project follows the [Google JavaScript style][google-js-style]. All the code must meet these rules, if not, feel free to patch this.

[google-js-style]: https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml

### Architecture

Everything is thought in components, this is a general structure of a component:

Component
  - attributes
    - name
    - type
    - parent
    - children
  - svg.js objects
    - root
    - childContainer
    - container
  - methods
    - constructor()
    - render()
    - some addAnything() methods
  - event callbacks
    - childChanged()
    - ...

The main component is a Workspace and this can have components attached, this components can be other workspaces. All must be nestable.

Workspace:
  - Blocks:
    - Fields:
      - Fields
    - Blocks
  - Workspaces

### Code structure

- *blocks*: Definitions of custom blocks using the Block API, in this folder there are some example and testing blocks.
- *fields*:  Definitions of custom fields using the Field API.
  - *FieldSVG, FieldText, FieldTextInput and FieldButton are implemented here*.
- *workspaces*:  Definitions of custom fields using the Field API.
  - *WorkspaceBasic are implemented here*.
- *core*: Main BBlocks classes
  - *BB.js*: This contains the namespace for all BBlocks clases this use the utils.js ObjJS library. All BBlock classes inherits from BB.Component.
  - *block.js*: BB.Block class: all blocks inherits from this. This implements the Block API.
  - *workspace.js*: BB.Workspace class: all workspaces inherits from this. This implements the Workspace API.
  - *field.js*: BB.Field class: all fields inherits from this. This implements the Field API.
  - *workspace_blocks.js*: not yet implemented, (this will contains all GUI attached to workspaces).
- *tests*: Tests for this project.
  - *blocks*: Tests for integration of Blocks and Fields.
  - *workspaces*: Tests for workspaces.
  - *playground.html*: Tests of integration of all components.
- *demos*: All demos of this project.
- *themes*: Styles for all objects.
  - *default*: Default theme files.
- *dist*: debug and production core files.
  - *BBlocks_compressed.js*: minified core.
  - *BBlocks_uncompressed.js*: concatenated core (for debugging).
- *libs*: Libraries used in this project.
  - *utils.js*: Useful functions and ObjJS class for dinamically creating classes.
  - *draggable.js*: Svg.js extension for make a component dragabble.
  - *pannable.js*: Svg.js extension for make a component pannable.
  - *resizable.js*: Svg.js extension for make a component resizable.
  - *scalable.js*: Svg.js extension for make a component scalable (zooming).
  - *thirdparty*: Thirdparty libraies used in this project.
    - *polymergestures.min.js*: Library for pointer gestures support (mouse, touch, pen ...).
    - *svg.min.js*: A lightweight library for manipulating and animating SVG.
    - *svg.path.min.js*: Svg.js extension for manipulating SVG paths.
    - *touch-emulator.js*: Library for emulate two finger gestures.
    - *svg.foreignobject.js*: Svg.js extension for manipulating SVG foreign objects.
