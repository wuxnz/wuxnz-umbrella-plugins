"use strict";
// Include ts-nocheck here if using modules that arent builtin
// to node and will live in the app's sandbox
// Modules included in the sandbox:
// - crypto-js (CryptoJS)
// - cheerio (Cheerio)
// You can use the modules above in this file via the name in parenthesis.
// You should only import built-in nodejs modules in this file with "require".
// !!WARNING!! You have to run "yarn install" and "npx tsc" in the nodejs-project folder.
// Example:
//   const $ = Cheerio.load(response);
//   const title = $('title').text();
//   var secret_key = CryptoJS.SHA256(title);
//   throw new Error(`${title} - ${secret_key}`); // This will throw an error in the app
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
//This is an example plugin. Do not use in production.
// Functions' return types are placeholders
// Actual types are in models/ folder
// Refer to models/ContentService.ts
class ExamplePlugin {
    search(query, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    getCategory(category, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    getHomeCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    getItemDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    getItemMedia(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
}
module.exports = {
    search: (query, page) => __awaiter(void 0, void 0, void 0, function* () { return new ExamplePlugin().search(query, page); }),
    getCategory: (category, page) => __awaiter(void 0, void 0, void 0, function* () { return new ExamplePlugin().getCategory(category, page); }),
    getHomeCategories: () => __awaiter(void 0, void 0, void 0, function* () { return new ExamplePlugin().getHomeCategories(); }),
    getItemDetails: (id) => __awaiter(void 0, void 0, void 0, function* () { return new ExamplePlugin().getItemDetails(id); }),
    getItemMedia: (id) => __awaiter(void 0, void 0, void 0, function* () { return new ExamplePlugin().getItemMedia(id); }),
};
exports.default = ExamplePlugin;
