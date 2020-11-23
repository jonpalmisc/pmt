const assert = require("assert");

const misc = require("../src/misc");

describe("misc", () => {
  describe("getTempPath", () => {
    it("Returns /tmp/pdtb_example.ext for example.ext", () => {
      assert.strictEqual(
        misc.getTempPath("example.ext"),
        "/tmp/pdtb_example.ext"
      );
    });

    it("Returns /tmp/pdtb_example.ext for /home/user/example.ext", () => {
      assert.strictEqual(
        misc.getTempPath("/home/user/example.ext"),
        "/tmp/pdtb_example.ext"
      );
    });
  });

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

  describe("verifyCommandExists", () => {
    it("Can find passwd", () => {
      assert.doesNotThrow(() => {
        misc.verifyCommandExists("passwd");
      });
    });

    it("Can't find ridiculous_fake_command_123", () => {
      assert.throws(() => {
        misc.verifyCommandExists("ridiculous_fake_command_123");
      });
    });
  });
});
