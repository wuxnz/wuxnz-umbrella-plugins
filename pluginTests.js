"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var GogoanimePlugin = require("./plugins/gogoanime/GogoanimePlugin");
var plugins = [GogoanimePlugin]; //, GogoanimePluginOld];
function testPlugin(plugin) {
    try {
        plugin.search("naruto", 1).then(function (res) {
            if (res.name) {
                console.log("\u2705 ".concat(res.name, " - ").concat(res.description));
            }
            else {
                console.log("\u274C Search failed for ".concat(plugin.constructor.name));
            }
        });
    }
    catch (error) {
        console.log("\u274C Search failed for ".concat(plugin.constructor.name, ": ").concat(error));
    }
}
plugins.forEach(function (plugin) {
    testPlugin(plugin);
});
