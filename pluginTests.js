"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const NineAnimePlugin = __importStar(require("./src/plugins/9anime/9animePlugin"));
const plugins = [NineAnimePlugin];
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
                                    console.log("Attempting to get media for first item...");
                                    try {
                                        yield plugin.getItemMedia(item.media[0].id).then((media) => {
                                            console.log(`✅ ${media.length} media found`);
                                        });
                                    }
                                    catch (error) {
                                        console.log(`❌ Media failed for ${res.items[0].id}: ${error}`);
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
