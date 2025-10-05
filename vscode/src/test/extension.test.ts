import * as assert from "assert";
import { getLogTemplate } from "../logTemplate";

describe("getLogTemplate", () => {
  it("returns JS/TS template", () => {
    assert.strictEqual(getLogTemplate("javascript", "myVar"), "console.log('myVar: ', myVar);");
    assert.strictEqual(getLogTemplate("typescript", "myVar"), "console.log('myVar: ', myVar);");
  });

  it("returns Java template", () => {
    assert.strictEqual(getLogTemplate("java", "myVar"), 'System.out.println("myVar: " + myVar);');
  });

  it("returns Python template", () => {
    assert.strictEqual(getLogTemplate("python", "myVar"), "print('myVar: ', myVar)");
  });

  it("returns Feature template", () => {
    assert.strictEqual(getLogTemplate("feature", "myVar"), "* print 'myVar: ', myVar");
  });

  it("falls back for unknown languages", () => {
    assert.strictEqual(getLogTemplate("ruby", "myVar"), "myVar");
  });
});
