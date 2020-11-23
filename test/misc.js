const assert = require("assert");

const misc = require("../src/misc");

describe("misc", () => {
  describe("replaceExt", () => {
    it("Changes example.pug to example.html", () => {
      assert.strictEqual(
        misc.replaceExt("example.pug", ".html"),
        "example.html"
      );
    });

    it("Changes /mnt/c/example.pug to /mnt/c/example.html", () => {
      assert.strictEqual(
        misc.replaceExt("/mnt/c/example.pug", ".html"),
        "/mnt/c/example.html"
      );
    });
  });

  describe("verifyFileExists", () => {
    it("Can find package.json", () => {
      assert.doesNotThrow(() => {
        misc.verifyFileExists("./package.json");
      });
    });

    it("Can't find package.yaml", () => {
      assert.throws(() => {
        misc.verifyFileExists("./package.yaml");
      });
    });
  });
});
