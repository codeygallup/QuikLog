import * as assert from "assert";
import { getLogTemplate } from "../logTemplate";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Should return JS/TS log template", () => {
    assert.strictEqual(
      getLogTemplate("javascript", "myVar"),
      "console.log('myVar: ', myVar);"
    );
    assert.strictEqual(
      getLogTemplate("typescript", "myVar"),
      "console.log('myVar: ', myVar);"
    );
  });

  test("Should return Java log template", () => {
    assert.strictEqual(
      getLogTemplate("java", "myVar"),
      'System.out.println("myVar: " + myVar);'
    );
  });

  test("Should return Python log template", () => {
    assert.strictEqual(
      getLogTemplate("python", "myVar"),
      "print('myVar: ', myVar)"
    );
  });

  test("Should return Feature log template", () => {
    assert.strictEqual(
      getLogTemplate("feature", "myVar"),
      "print 'myVar: ', myVar"
    );
  });

  test("Should return default log template for unknown languages", () => {
    assert.strictEqual(getLogTemplate("ruby", "myVar"), "myVar");
  });
});
