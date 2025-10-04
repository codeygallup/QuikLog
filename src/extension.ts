// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { getLogTemplate } from "./logTemplate";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "quiklog" is now active!');

  // Command: insert a formatted log for the currently selected variable or the word at cursor
  const insertLogDisposable = vscode.commands.registerCommand(
    "quiklog.insertLog",
    async () => {
      const editor: vscode.TextEditor | undefined =
        vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor");
        return;
      }

      const document = editor.document;
      const selection = editor.selection;
      let variable = document.getText(selection).trim();

      if (!variable) {
        vscode.window.showInformationMessage(
          "Please highlight a variable to insert a QuikLog."
        );
        return;
      }

      const language = document.languageId;
      const template = getLogTemplate(language, variable);

      // Insert the template on the next line after the current selection
      const lineEnd: vscode.Position = document.lineAt(selection.end.line).range
        .end;
      await editor.edit((editBuilder) => {
        editBuilder.insert(lineEnd, "\n" + template);
      });
    }
  );

  context.subscriptions.push(insertLogDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
