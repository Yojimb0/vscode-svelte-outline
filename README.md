# Svelte Function Outline

**Svelte Function Outline** is a Visual Studio Code extension that provides a tree view of functions within Svelte files. This extension helps developers navigate and manage their Svelte components more efficiently by displaying a hierarchical list of functions defined in the `<script>` tag of Svelte files.

## Features

- **Function Hierarchy**: Displays a nested tree view of functions within Svelte files.
- **Quick Navigation**: Allows users to quickly navigate to function definitions within the editor.
- **Automatic Refresh**: Automatically updates the tree view when the active editor changes or the document is saved.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`.
3. Search for "Svelte Function Outline" and click "Install".

## Usage

1. Open a Svelte file (`.svelte`) in the editor.
2. The "Svelte Function Outline" view will appear in the Explorer panel, showing a list of functions defined in the `<script>` tag.
3. Click on a function in the tree view to navigate to its definition in the editor.

## Commands

- **Go to Function**: Navigates the editor to the selected function's definition.

## Requirements

- Visual Studio Code
- Svelte files with `<script lang="ts">` tags

## Known Limitations

- Currently supports only TypeScript functions defined within `<script lang="ts">` tags.
- Nested functions are displayed with indentation to represent their hierarchy.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This extension is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
