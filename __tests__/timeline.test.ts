let timeline = require("../dist/index");

test("timeline ", () => {
  let container = document.createElement("div");
  new timeline.Timeline(container);

  expect(container.children[0].className).toContain("styles-module_timeline");
});
