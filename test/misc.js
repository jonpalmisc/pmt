const assert = require("assert");

const misc = require("../src/misc");

describe("misc", () => {
  describe("getTempPath", () => {
    it("Returns /tmp/pmt_example.ext for example.ext", () => {
      assert.strictEqual(
        misc.getTempPath("example.ext"),
        "/tmp/pmt_example.ext"
      );
    });

    it("Returns /tmp/pmt_example.ext for /home/user/example.ext", () => {
      assert.strictEqual(
        misc.getTempPath("/home/user/example.ext"),
        "/tmp/pmt_example.ext"
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
});
