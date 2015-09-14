# BBlocks.js (alpha version)

BBlocks is lightweight, flexible, simplist and hackable graphical library for building GUIs based on SVG components. This project is mainly inspired in [Blockly][blockly-git] and [Snap-BYOB][snap-git] awesome projects.

The main idea is make a graphical library with some advanced features for use in a block editor, but can be used in anything. The goal is construct an advanced visual programming editor in top of this project. The editor should be able to be used in production, either individually or as embedded editor, see the [BB editor][bb-editor-git] project.

A [live demo][livedemo].
[livedemo]: https://carloslfu.github.io/BBlocks.js/demos/basic/demo.html

![example1](https://github.com/carloslfu/BBlocks.js/blob/master/BB.jpg)
![example2](https://github.com/carloslfu/BBlocks.js/blob/master/BB_with_zoom.jpg)

## Features

- SVG based (uses [SVG.js][svgjs-git]).
- All is nestable.
- Zoomable, resizable and pannabble workspaces.
- Touch Gestures support (uses [polymer-gestures][polymer-gestures-git]).

### Core components

- Workspace.
- Block (An abstraction similar to Blockly and Snap blocks).
- Field.

### Workspaces

- Basic Workspace: resize box, drag box and some styles.

### Fields

- Svg.
- Button.
- Text.
- Text input.

### Blocks

Some examples and test blocks:

- test: Simple block with a text field.
- test_dev: Block with an animation.
- example: Block with many fields.

## Getting started

See the demos folder. All documentation is in construction... (github wiki coming soon). Visit the [BBlocks group][BBlocks-group] for get some feedback.

## Features that will be implemented

- Interaction between objects (Workspaces, blocks ...).
- Menu component.
- Dropdown field.
- SVG contextmenu.
- Multiple blocks selection.
- SVG textarea input field.
- Pugins API.
- Styling API.

## Future

Last year I learned a lot about web development. I developed web applications with fascinating and very promising technologies. My aim now is to apply this knowledge in the project, build a simple and powerful tool that meets all the objectives of this project. It will simplify their development and much of the complexity associated to the construction of this tool.

This will be done in a new branch and when it has the same functionality of the current branch will replace the master. Here are some advances in architecture to be implemented:

- Architecture: [redux][redux-page]
- UI construction: [react][react-page]
- UI debugging: [react-hot-loader][react-hot-page]
- Developer experience: [redux-dev-tools][redux-dev-tools-page]
- Packaging tools: [webpack][webpack-page]

[redux-page]: http://rackt.github.io/redux/
[redux-dev-tools-page]: https://github.com/gaearon/redux-devtools
[webpack-page]: https://webpack.github.io/
[react-page]: http://facebook.github.io/react/
[react-hot-page]: http://gaearon.github.io/react-hot-loader/

## Development

Feel free to suggest anything or submit a pull request. Visit the [contributing page][Contributing-guide] and the [documentation page][docs-page].

Board on trello [BBlocks][BBlocks-trello].

[BBlocks-group]: https://groups.google.com/forum/?hl=es#!forum/bblocks
[Contributing-guide]: https://github.com/carloslfu/BBlocks.js/blob/master/CONTRIBUTING.md
[docs-page]: https://github.com/carloslfu/BBlocks.js/blob/master/DOCS.md
[BBlocks-trello]: https://trello.com/b/0u71Uj56/bblocks-js

[blockly-git]: https://github.com/google/blockly
[snap-git]: https://github.com/jmoenig/Snap--Build-Your-Own-Blocks
[bb-editor-git]: https://github.com/carloslfu/BB-editor
[pep-git]: https://github.com/jquery/PEP
[svgjs-git]: https://github.com/wout/svg.js
[polymer-gestures-git]:https://github.com/Polymer/polymer-gestures
