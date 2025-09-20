"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GogoanimeOld_1 = __importDefault(require("./plugins/gogoanime-old/GogoanimeOld"));
const plugins = [GogoanimeOld_1.default];
function testPlugin(plugin) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield plugin.search("one", 1).then((res) => __awaiter(this, void 0, void 0, function* () {
                if (res.name) {
                    console.log(`✅ ${res.name} - ${res.description}`);
                    if (res.items.length > 0) {
                        console.log(`✅ ${res.items.length} items found.`);
                        console.log(`Attempting to get details for first item with id ${res.items[0].id}...`);
                        try {
                            yield plugin.getItemDetails(res.items[0].id).then((item) => __awaiter(this, void 0, void 0, function* () {
                                console.log(`✅ ${item.name} - ${item.description}`);
                                if (item.media.length > 0) {
                                    console.log(`✅ ${item.media.length} media found`);
                                    console.log(`Attempting to get media for first item ${item.media[0].id}...`);
                                    try {
                                        yield plugin.getItemMedia(item.media[0].id).then((media) => {
                                            console.log(`✅ ${media.length} media found`);
                                        });
                                    }
                                    catch (error) {
                                        console.log(`❌ Media failed for ${item.media[0].id}: ${error}`);
                                    }
                                }
                                else {
                                    console.log(`❌ No media found`);
                                }
                            }));
                        }
                        catch (error) {
                            console.log(`❌ Item details failed for ${res.items[0].id}: ${error}`);
                        }
                    }
                    else {
                        console.log(`❌ No items found`);
                    }
                }
                else {
                    console.log(`❌ Search failed for ${plugin.constructor.name}`);
                }
            }));
        }
        catch (error) {
            console.log(`❌ Search failed for ${plugin.constructor.name}: ${error}`);
        }
        try {
            yield plugin.getHomeCategories().then((categories) => __awaiter(this, void 0, void 0, function* () {
                console.log(`✅ ${categories.length} home categories found.`);
                console.log(`✅ ${categories[0].items.length} items found.`);
                console.log(`Attempting to get details for first category first item ${categories[0].items[0].name}...`);
                try {
                    yield plugin
                        .getItemDetails(categories[0].items[0].id)
                        .then((item) => __awaiter(this, void 0, void 0, function* () {
                        console.log(`✅ ${item.name} - ${item.description} (${item.id})`);
                        if (item.media.length > 0) {
                            console.log(`✅ ${item.media.length} media found`);
                            console.log(`Attempting to get media for first item (number ${item.media[0].number})...`);
                            try {
                                yield plugin.getItemMedia(item.media[0].id).then((media) => {
                                    console.log(`✅ ${media.length} media found`);
                                });
                            }
                            catch (error) {
                                console.log(`❌ Media failed for ${categories[0].items[0].id}: ${error}`);
                            }
                        }
                        else {
                            console.log(`❌ No media found`);
                        }
                    }));
                }
                catch (error) {
                    console.log(`❌ Category details failed for ${categories[0].items[0].id}: ${error}`);
                }
            }));
        }
        catch (error) {
            console.log(`❌ Home categories failed for ${plugin.constructor.name}: ${error}`);
        }
    });
}
plugins.forEach((plugin) => {
    testPlugin(plugin);
});
