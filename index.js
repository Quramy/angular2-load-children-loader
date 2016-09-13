"use strict";

var path = require("path");
var loadChildrenRegex = /loadChildren\s*:(.*)$/gm;
var ngfactoryRegex = /\.ngfactory(\.|$)/;
var stringRegex = /(['"])((?:[^\\]\\\1|.)*?)\1/g;

function replacePath(str, addSuffix) {
  return str.replace(stringRegex, function(match, quote, pathAndFragment) {
    var tmp = pathAndFragment.split("#");
    var fpath = addSuffix ? tmp[0] + ".ngfactory" : tmp[0];
    var moduleName;
    if (tmp.length < 2) {
      return 'require("' + fpath + '")()';
    } else {
      moduleName = addSuffix ? tmp[1] + "NgFactory" : tmp[1]
      return 'require("' + fpath + '")("' + moduleName + '")';
    }
  });
}

/**
 * This webpack loader is designed for using with Angular2 Lazy Module Loading.
 *
 * INPUT: { loadChildren: "./sub.module#SubModule" }
 *
 * If JiT context(not *.ngfactory.ts),
 * OUT: { loadChildren: () => require("./sub.module")("SubModule") };
 *
 * If AoT context(*.ngfactory.ts)
 * OUT: { loadChildren: () => require("./sub.module.ngfactory")("SubModuleNgFactory") };
 *
 * And you can use https://github.com/gdi2290/es6-promise-loader to separeate chunk(submodule) files.
 *
**/
module.exports = function(source) {
  this.cacheable && this.cacheable();
  var addSuffix = ngfactoryRegex.test(path.basename(this.resourcePath));
  var newSource = source.replace(loadChildrenRegex, function(match, path) {
    var trimmed = path.trim();
    if (trimmed[0] !== '"' && trimmed[0] !== "'") return match;
    return 'loadChildren: () =>' + replacePath(path, addSuffix);
  });
  return newSource;
};
