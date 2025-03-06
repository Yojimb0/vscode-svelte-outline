const vscode = require('vscode');

class SvelteFunctionProvider {
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element) {
    return element;
  }

  async getChildren() {
    const editor = vscode.window.activeTextEditor;
    if (!editor || !editor.document.fileName.endsWith('.svelte')) {
      return [];
    }

    const text = editor.document.getText();
    const functions = this.findFunctions(text);
    
    return this.buildFunctionHierarchy(functions);
  }

  buildFunctionHierarchy(functions) {
    const treeItems = [];
    
    for (const func of functions) {
      const treeItem = new vscode.TreeItem(
        func.name,
        vscode.TreeItemCollapsibleState.None
      );
      
      // Add indentation, emoji (wrench for regular functions, sparkles for HOF), function name and line number
      const emoji = '🔧';
      treeItem.label = '  '.repeat(func.nestingLevel) + emoji + ' ' + func.name;
      
      treeItem.command = {
        command: 'svelteFunctionOutline.gotoLine',
        title: 'Go to Function',
        arguments: [func.line, func.column]
      };
      
      treeItems.push(treeItem);
    }
    
    return treeItems;
  }

  findFunctions(text) {
    const functions = [];
    const lines = text.split('\n');
    let scriptContent = '';
    let inScript = false;
    let lineOffset = 0;
    let braceStack = [];
    
    // Extract script content
    lines.forEach((line, index) => {
      if (line.match(/<script lang="ts">/)) {
        inScript = true;
        lineOffset = index + 1;
        return;
      }
      if (line.includes('</script>')) {
        inScript = false;
        return;
      }
      if (inScript) {
        scriptContent += line + '\n';
      }
    });

    // Split script content into lines for better analysis
    const scriptLines = scriptContent.split('\n');
    let nestingLevel = 0;

    for (let i = 0; i < scriptLines.length; i++) {
      const line = scriptLines[i];
      
      // Track brace nesting
      for (const char of line) {
        if (char === '{') braceStack.push(i);
        if (char === '}' && braceStack.length > 0) braceStack.pop();
      }

      // Regular function patterns
      const functionPatterns = [
        /(?:const|let)\s+(\w+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|\w+)\s*=>/
      ];

      // Check for regular functions
      for (const pattern of functionPatterns) {
        const match = line.match(pattern);
        if (match) {
          const name = match[1] || match[2];
          const column = line.indexOf(match[0]);
          nestingLevel = braceStack.length;

          functions.push({
            name,
            line: i + lineOffset,
            column,
            nestingLevel: Math.max(0, nestingLevel - 1)
          });
        }
      }
    }

    return functions;
  }
}

function activate(context) {
  const functionProvider = new SvelteFunctionProvider();
  
  vscode.window.registerTreeDataProvider(
    'svelteFunctionOutline',
    functionProvider
  );

  let disposable = vscode.commands.registerCommand(
    'svelteFunctionOutline.gotoLine',
    (line, column) => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        // Create position with both line and column information
        const position = new vscode.Position(line, column);
        
        // Set selection and reveal the position
        editor.selection = new vscode.Selection(position, position);
        editor.revealRange(
          new vscode.Range(position, position),
          vscode.TextEditorRevealType.InCenter
        );

        // Focus the editor
        vscode.window.showTextDocument(editor.document, {
          selection: new vscode.Selection(position, position),
          preserveFocus: false
        });
      }
    }
  );

  context.subscriptions.push(disposable);

  // Refresh the tree view when the active editor changes
  vscode.window.onDidChangeActiveTextEditor(() => {
    functionProvider.refresh();
  });

  // Refresh when the document is saved
  vscode.workspace.onDidSaveTextDocument(() => {
    functionProvider.refresh();
  });
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};