var assert = require("assert");
var loader = require("../index");

describe("angular2-load-children-loader", function() {

  it("returns require expression without suffix when JiT context", function () {
    var inputSource = `{ loadChildren: "./subModule#SubModule" }`;
    var expected    = `{ loadChildren: () => require("./subModule")("SubModule") }`;
    var actual = loader.bind({ cacheable: false, resourcePath: "./app.routing.ts" })(inputSource);
    assert.equal(actual, expected);
  });

  it("returns require expression without suffix when JiT context, single quote", function () {
    var inputSource = `{ loadChildren: './subModule#SubModule' }`;
    var expected    = `{ loadChildren: () => require("./subModule")("SubModule") }`;
    var actual = loader.bind({ cacheable: false, resourcePath: "./app.routing.ts" })(inputSource);
    assert.equal(actual, expected);
  });

  it("returns require expression with 'ngfactory' suffix when AoT context", function () {
    var inputSource = `{ loadChildren: "./subModule#SubModule" }`;
    var expected    = `{ loadChildren: () => require("./subModule.ngfactory")("SubModuleNgFactory") }`;
    var actual = loader.bind({ cacheable: false, resourcePath: "./app.module.ngfactory.ts" })(inputSource);
    assert.equal(actual, expected);
  });

  it("pass through loadChildren property is not string", function () {
    var inputSource = `{ loadChildren: () => "./subModule#SubModule" }`;
    var actual = loader.bind({ cacheable: false, resourcePath: "./app.routing.ts" })(inputSource);
    assert.equal(actual, inputSource);
  });
});
