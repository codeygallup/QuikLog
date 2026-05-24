package com.codeygallup.quiklogintellij

import com.intellij.openapi.actionSystem.ActionUpdateThread
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.CommonDataKeys
import com.intellij.openapi.command.WriteCommandAction
import com.intellij.openapi.editor.Editor
import com.intellij.openapi.project.Project
import com.intellij.openapi.ui.Messages
import com.intellij.openapi.util.TextRange

class InsertLogAction : AnAction() {

    override fun getActionUpdateThread(): ActionUpdateThread {
        return ActionUpdateThread.BGT
    }
    override fun actionPerformed(e: AnActionEvent) {
        val project: Project = e.project ?: return
        val editor: Editor = e.getData(CommonDataKeys.EDITOR) ?: return
        val document = editor.document
        val caretModel = editor.caretModel
        val selectionModel = editor.selectionModel

        // Grab the word at the cursor
        var variable = selectionModel.selectedText?.trim() ?: ""

        // If nothing is selected, use the word under the cursor
        if (variable.isEmpty()) {
            val offset = caretModel.offset
            val text = document.charsSequence

            var start = offset
            var end = offset

            while (start > 0 && isWordChar(text[start - 1])) {
                start--
            }

            while (end < text.length && isWordChar(text[end])) {
                end++
            }

            if (start < end) {
                variable = text.substring(start, end).trim()
            }
        }

        if (variable.isEmpty()) {
            Messages.showInfoMessage(
                project,
                "Please highlight a variable or put the cursor on one to insert a QuikLog.",
                "QuikLog"
            )
            return
        }

        val file = e.getData(CommonDataKeys.PSI_FILE) ?: return
        val fileExtension = file.virtualFile?.extension ?: ""

        val template = getLogTemplate(fileExtension, variable)

        val currentLine = caretModel.logicalPosition.line
        val lineStartOffset = document.getLineStartOffset(currentLine)
        val lineEndOffset = document.getLineEndOffset(currentLine)
        val lineText = document.getText(TextRange(lineStartOffset, lineEndOffset))

        val indent = lineText.takeWhile { it.isWhitespace() }

        WriteCommandAction.runWriteCommandAction(project) {
            val insertOffset = lineEndOffset
            document.insertString(insertOffset, "\n$indent$template")
        }
    }

    private fun isWordChar(c: Char): Boolean {
        return c.isLetterOrDigit() || c == '_' || c == '$'
    }

    private val templateMap: Map<String, (String) -> String> = mapOf(
        "js"      to { v -> "console.log('$v: ', $v);" },
        "ts"      to { v -> "console.log('$v: ', $v);" },
        "jsx"     to { v -> "console.log('$v: ', $v);" },
        "tsx"     to { v -> "console.log('$v: ', $v);" },
        "java"    to { v -> "System.out.println(\"$v: \" + $v);" },
        "py"      to { v -> "print('$v: ', $v)" },
        "feature" to { v -> "* print '$v: ', $v" },
        "c"       to { v -> "printf(\"%s: %d\\n\", \"$v\", $v);" },
        "cpp"     to { v -> "std::cout << \"$v: \" << $v << std::endl;" },
        "cc"      to { v -> "std::cout << \"$v: \" << $v << std::endl;" },
        "cs"      to { v -> "Console.WriteLine(\"$v: \" + $v);" },
    )

    private fun getLogTemplate(fileExtension: String, variable: String): String {
        return templateMap[fileExtension]?.invoke(variable) ?: variable
    }

    override fun update(e: AnActionEvent) {
        val editor = e.getData(CommonDataKeys.EDITOR)
        e.presentation.isEnabledAndVisible = editor != null
    }

}