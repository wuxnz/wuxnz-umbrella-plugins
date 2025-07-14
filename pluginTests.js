"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NineAnimePlugin = require("./plugins/9anime/9animePlugin");
var plugins = [NineAnimePlugin];
function testPlugin(plugin) {
    try {
        plugin.search("one", 1).then(function (res) {
            if (res.name) {
                console.log("\u2705 ".concat(res.name, " - ").concat(res.description));
                if (res.items.length > 0) {
                    console.log("\u2705 ".concat(res.items.length, " items found."));
                    console.log("Attempting to get details for first item...");
                    try {
                        plugin.getItemDetails(res.items[0].id).then(function (item) {
                            console.log("\u2705 ".concat(item.name, " - ").concat(item.description));
                            if (item.media.length > 0) {
                                console.log("\u2705 ".concat(item.media.length, " media found"));
                                console.log("Attempting to get media for first item...");
                                try {
                                    plugin.getItemMedia(item.media[0].id).then(function (media) {
                                        console.log("\u2705 ".concat(media.length, " media found"));
                                    });
                                }
                                catch (error) {
                                    console.log("\u274C Media failed for ".concat(res.items[0].id, ": ").concat(error));
                                }
                            }
                            else {
                                console.log("\u274C No media found");
                            }
                        });
                    }
                    catch (error) {
                        console.log("\u274C Item details failed for ".concat(res.items[0].id, ": ").concat(error));
                    }
                }
                else {
                    console.log("\u274C No items found");
                }
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
