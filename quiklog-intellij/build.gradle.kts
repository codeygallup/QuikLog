plugins {
    id("java")
    id("org.jetbrains.kotlin.jvm") version "2.1.20"
    id("org.jetbrains.intellij.platform") version "2.10.2"
}

group = "com.codeygallup"
version = "1.0.1"

repositories {
    mavenCentral()
    intellijPlatform {
        defaultRepositories()
    }
}

// Read more: https://plugins.jetbrains.com/docs/intellij/tools-intellij-platform-gradle-plugin.html
dependencies {
    intellijPlatform {
        intellijIdea("2025.2.4")
        testFramework(org.jetbrains.intellij.platform.gradle.TestFrameworkType.Platform)


        // Add plugin dependencies for compilation here, example:
        // bundledPlugin("com.intellij.java")
    }
}

intellijPlatform {
    pluginConfiguration {
        name = "QuikLog"
        version = "1.0.1"
        description = """
            QuikLog lets you quickly insert debug log statements for any variable in your code. Stop writing repetitive console.log statements manually!
        """.trimIndent()

        ideaVersion {
            sinceBuild = "252.25557"
        }

        changeNotes = """
            <h3>1.0.1</h3>
            <ul>
                <li>Added plugin icon</li>
            </ul>
            <h3>1.0.0</h3>
            <ul>
                <li>Initial release</li>
                <li>Support for Java, Python, JavaScript, TypeScript, C, C++, C#, and more</li>
                <li>Keyboard Shortcut: ctrl + alt + l</li>
            </ul>
        """.trimIndent()
    }
}

tasks {
    // Set the JVM compatibility versions
    withType<JavaCompile> {
        sourceCompatibility = "21"
        targetCompatibility = "21"
    }
}

kotlin {
    compilerOptions {
        jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_21)
    }
}
