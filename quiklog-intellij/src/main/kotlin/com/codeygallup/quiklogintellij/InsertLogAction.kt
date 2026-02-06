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
        val language = file.language.id.lowercase() ?: ""

        val template = getLogTemplate(language, fileExtension, variable)

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

    private fun getLogTemplate(language: String, fileExtension: String, variable: String): String {
        return when {
            language.contains("javascript") || language.contains("typescript") || fileExtension in listOf("js", "jsx", "ts", "tsx") -> "console.log('$variable: ', $variable);"

            language.contains("java") || fileExtension == "java" -> "System.out.println(\"$variable: \" + $variable);"

            language.contains("python") || fileExtension == "py" -> "print('$variable: ', $variable);"

            fileExtension == "feature" -> "* print '$variable: ', $variable"

            language == "c" || fileExtension == "c" -> "printf(\"%s: %d\\n\", \"$variable\", $variable);"

            language.contains("c++") || language == "objectivec" || fileExtension in listOf("cpp", "cc", "cxx", "hpp", "h") -> "std::cout << \"$variable: \" << $variable << std::endl;"

            language.contains("c#") || fileExtension == "cs" -> "Console.WriteLine(\"$variable: \" + $variable);"

            else -> variable
        }
    }

    override fun update(e: AnActionEvent) {
        val editor = e.getData(CommonDataKeys.EDITOR)
        e.presentation.isEnabledAndVisible = editor != null
    }

}