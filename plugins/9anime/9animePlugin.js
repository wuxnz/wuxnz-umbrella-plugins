"use strict";
// import { Cheerio, CheerioAPI } from "cheerio";
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
// const cheerio = require("cheerio");
class ExamplePlugin {
    constructor() {
        this.baseUrl = "https://9animetv.to";
    }
    search(query, page) {
        return __awaiter(this, void 0, void 0, function* () {
            var baseUrl = this.baseUrl;
            const url = `${baseUrl}/search?keyword=${query}&page=${page || 1}`;
            const response = yield fetch(url)
                .then((response) => response)
                .then((data) => data.text());
            if (!response) {
                return {};
            }
            // @ts-expect-error
            const $ = Cheerio.load(response); // as CheerioAPI;
            var items = [];
            var index = 0;
            $(".flw-item").each(function () {
                var item = {};
                item["id"] = $(this).find("a").attr("href").split("/")[2];
                throw new Error(`${item["id"]}`);
                item["name"] = $(this).find(".title").text().trim();
                item["description"] = $(`#qtip-${index}-content`)
                    ._findBySelector("div:nth-child(1) > div:nth-child(7)", 1)
                    .text()
                    .trim();
                item["imageUrl"] = $(this).find("img").attr("src");
                item["url"] = $(this).find("a").attr("href").startsWith("/")
                    ? `${baseUrl}${$(this).find("a").attr("href")}`
                    : $(this).find("a").attr("href");
                item["type"] = "Video";
                items.push(item);
                index++;
            });
            return {
                name: "9anime",
                description: `Search results for ${query}`,
                url: url,
                isPaginated: true,
                nextPageNumber: page + 1,
                previousPageNumber: page > 1 ? page - 1 : undefined,
                items: items,
            };
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
