// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { getLogTemplate } from "./logTemplate";

function findInsertLine(
  document: vscode.TextDocument,
  lineNumber: number,
): number {
  const currentLineText = document.lineAt(lineNumber).text.trim();

  // Only apply smart insert for lines ending with a comma (destructuring/object patterns)
  if (!currentLineText.endsWith(",")) return lineNumber;

  let balance = 0;

  for (let i = 0; i <= lineNumber; i++) {
    for (const char of document.lineAt(i).text) {
      if ("{[(".includes(char)) balance++;
      if ("}])".includes(char)) balance--;
    }
  }

  if (balance > 0) {
    for (let i = lineNumber + 1; i < document.lineCount; i++) {
      for (const char of document.lineAt(i).text) {
        if ("{[(".includes(char)) balance++;
        if ("}])".includes(char)) balance--;
      }
      if (balance <= 0) return i;
    }
  }

  return lineNumber;
}

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

      // If no text is selected, get the word at the cursor position
      if (!variable) {
        const wordRange = document.getWordRangeAtPosition(selection.active);
        if (wordRange) {
          variable = document.getText(wordRange).trim();
        }
      }

      if (!variable) {
        vscode.window.showInformationMessage(
          "Please highlight a variable or put the cursor on it to insert a QuikLog.",
        );
        return;
      }

      const language = document.languageId;
      const template = getLogTemplate(language, variable);

      // Insert the template on the next line after the current selection
      const targetLineIndex = findInsertLine(document, selection.end.line);
      const targetLine = document.lineAt(targetLineIndex);
      const lineEnd = targetLine.range.end;
      const indent = document
        .lineAt(selection.end.line)
        .text.substring(
          0,
          document.lineAt(selection.end.line).firstNonWhitespaceCharacterIndex,
        );

      await editor.edit((editBuilder) => {
        editBuilder.insert(lineEnd, "\n" + `${indent}${template}`);
      });
    },
  );

  context.subscriptions.push(insertLogDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
