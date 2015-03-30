# BBlocks.js

This page contains the documentation of the proyect. All of this content should be merged in the proyect wiki. This docs are in construction ...

## Develop

### Coding

This proyect follow the [Google JavaScript style][google-js-style] (FIX this link). The all the code must meet these rules, if not feel free to patch this.

[google-js-style]:http//google.com

### Architecture

Everything is thought in components, this is a general structure of a component:

Component
  // attributes
  - name
  - type
  - parent
  - children
  // svg.js objects
  - root
  - childContainer
  - container
  // methods
  - constructor()
  - render()
  - some addAnything() methods
  // event callbacks
  - childChanged()
  - ...

The main component is a Workspace and this can have components attached, this components can be other workspaces. All must be nestable.

Workspace:
  ->Blocks:
  --------> Fields:
  ------------> Fields
  --------> Blocks
  ->Workspaces

### Code structure

blocks  -> Definitions of custom blocks using the Block API, in this folder there are some example and testing blocks.

fields  -> Definitions of custom fields using the Field API.
---------> FieldSVG, FieldText and FieldButton are implemented.

themes  -> Styles for all objects.
themes/default     -> Default theme files.

core    -> Main BBlocks classes
core/BB.js        -> This contains the namespace for all BBlocks clases this use the utils.js ObjJS library
-------------------> All BBlock classes inherits from BB.Object
core/block.js     -> BB.Block class: all blocks inherits from this. This implements the Block API.
core/workspace.js -> BB.Workspace class: all workspaces inherits from this. This implements the Workspace API.
core/field.js     -> BB.Field class: all fields inherits from this. This implements the Field API.
core/workspace_blocks.js -> not yet implemented, (this will contains all GUI attached to workspaces).

tests    -> Tests for this proyect.
tests/blocks          -> Tests for integration of Blocks and Fields.
tests/workspaces      -> Tests for workspaces.
tests/playground.html -> Tests of integration of all components.

demos    -> All demos of this proyect.

libs     -> Libraries used in this proyect.
libs/utils.js      -> Useful functions and ObjJS class for dinamically creating classes.
libs/draggable.js  -> Svg.js extension for make a component dragabble.
libs/pannable.js   -> Svg.js extension for make a component pannable.
libs/resizable.js  -> Svg.js extension for make a component resizable.
libs/scalable.js   -> Svg.js extension for make a component scalable (zooming).
libs/thirdparty -> Thirdparty libraies used in this proyect.
libs/thirdparty/polymergestures.min.js -> Library for pointer gestures support (mouse, touch, pen ...).
libs/thirdparty/svg.min.js             -> A lightweight library for manipulating and animating SVG.
libs/thirdparty/svg.path.min.js        -> Svg.js extension for manipulating SVG paths.
libs/thirdparty/touch-emulator.js      -> Library for emulate two finger gestures.
libs/thirdparty/svg.foreignobject.js   -> Svg.js extension for manipulating SVG foreign objects (isn't used yet).
