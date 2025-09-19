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
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = require("cheerio");
class GogoanimeOld {
    constructor() {
        this.baseUrl = "https://www13.gogoanimes.fi";
        this.sourceType = "Video";
    }
    search(query, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var baseUrl = this.baseUrl;
                const url = `${baseUrl}/search?keyword=${query}&page=${page || 1}`;
                const response = yield fetch(url)
                    .then((response) => response)
                    .then((data) => data.text());
                if (!response) {
                    return {};
                }
                const items = [];
                const $ = (0, cheerio_1.load)(response);
                $(".items li").each(function () {
                    var item = {};
                    item["id"] = $(this).find("a").attr("href").split("/")[2];
                    item["name"] = $(this).find(".name a").text().trim();
                    item["description"] = $(`this`).find(".released").text().trim();
                    item["imageUrl"] = $(this).find("img").attr("src").startsWith("/")
                        ? `${baseUrl}${$(this).find("img").attr("src")}`
                        : $(this).find("img").attr("src");
                    item["url"] = $(this).find("a").attr("href").startsWith("/")
                        ? `${baseUrl}${$(this).find("a").attr("href")}`
                        : $(this).find("a").attr("href");
                    item["type"] = "Video";
                    items.push(item);
                });
                return {
                    name: "Gogoanime (Old)",
                    description: `Search results for ${query}`,
                    url: decodeURIComponent(`${this.baseUrl}/search.html?keyword=${query}&page=${page}`),
                    isPaginated: true,
                    nextPageNumber: page + 1,
                    previousPageNumber: page > 1 ? page - 1 : undefined,
                    items: items,
                };
            }
            catch (err) {
                throw err;
            }
        });
    }
    getCategory(category, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    getHomeCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const baseUrl = this.baseUrl;
            const response = yield fetch(`${baseUrl}`)
                .then((response) => response)
                .then((data) => data.text());
            const $ = (0, cheerio_1.load)(response);
            var categories = [];
            categories.push({
                name: "Recently Released",
                url: baseUrl,
                isPaginated: false,
                items: (($) => {
                    var items = [];
                    $("#anime-list li").each(function () {
                        items.push({
                            id: $(this)
                                .find("a")
                                .attr("href")
                                .split(baseUrl)[1]
                                .substring(1, $(this).find("a").attr("href").split(baseUrl)[1].length - 1)
                                .replace(/episode-([0-9]+)/, ""),
                            name: $(this).find("a").attr("title").trim(),
                            description: $(this).find(".episode").text().trim(),
                            imageUrl: $(this).find("img").attr("src").startsWith("/")
                                ? `${baseUrl}${$(this).find("img").attr("src")}`
                                : $(this).find("img").attr("src"),
                            url: $(this).find("a").attr("href").startsWith("/")
                                ? `${baseUrl}${$(this).find("a").attr("href")}`
                                : $(this).find("a").attr("href"),
                            type: "Video",
                        });
                    });
                    return items;
                })($),
            });
            categories.push({
                name: "Popular Ongoing",
                url: baseUrl,
                isPaginatied: false,
                items: (($) => {
                    var items = [];
                    const imageUrlRegex = /url\("(.*?)"\)/;
                    $("div.popular > ul:nth-child(1) > li").each(function () {
                        var _a;
                        items.push({
                            id: $(this)
                                .find("a")
                                .attr("href")
                                .split("/anime/")[1]
                                .substring(0, $(this).find("a").attr("href").split("/anime/")[1].length - 1),
                            name: $(this).find("a").attr("title").trim(),
                            description: $(this).find(".episode").text().trim(),
                            imageUrl: (_a = $(this)
                                .find("div.thumbnail-popular")
                                .attr("style")
                                .match(imageUrlRegex)) === null || _a === void 0 ? void 0 : _a[1],
                            url: $(this).find("a").attr("href").startsWith("/")
                                ? `${baseUrl}${$(this).find("a").attr("href")}`
                                : $(this).find("a").attr("href"),
                            type: "Video",
                        });
                    });
                    return items;
                })($),
            });
            return categories;
        });
    }
    getItemDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.baseUrl}/category/${id}`;
            const response = yield fetch(url)
                .then((response) => response)
                .then((data) => data.text());
            if (!response) {
                return {};
            }
            const nameRegex = /<h1>([\s\S]*?)<\/h1>/;
            const name = response.match(nameRegex)[1].trim();
            const descriptionRegex = /Type:[\s\S]*?title="(.*)"/;
            const description = response.match(descriptionRegex)[1].trim();
            const imageUrlRegex = /anime_info_body_bg">[\s\S]*?<img[\s\S]*?src="(.*?)"/;
            var imageUrl = response.match(imageUrlRegex)[1];
            if (imageUrl.startsWith("/")) {
                imageUrl = `${this.baseUrl}/${imageUrl}`;
            }
            const language = name.includes("(Dub)") ? "English" : "Sub";
            const synopsisRegex = /Synopsis: ([\s\S]*?)<\/div>/;
            var synopsis = response.match(synopsisRegex)[1].trim();
            const openingTagRegex = /<.*?>/g;
            synopsis = synopsis.replace(openingTagRegex, "");
            const closingTagRegex = /<\/.*?>/g;
            synopsis = synopsis.replace(closingTagRegex, "");
            const genres = [];
            const genresElementRegex = /Genre:.*<\/span>[\s\S]*?<\/p>/;
            const genresElement = response.match(genresElementRegex)[0];
            const genresRegex = /<a[\s\S]*?href='(.*?)'[\s\S]*?title='(.*?)'/g;
            const genresList = [...genresElement.matchAll(genresRegex)];
            for (const genre of genresList) {
                if (genre[1].startsWith("/")) {
                    genre[1] = `${this.baseUrl}/${genre[1]}`;
                }
                if (genre[1] === "javascript:void(0);") {
                    continue;
                }
                genres.push({
                    id: genre[1].split("/").pop(),
                    name: genre[2],
                    url: genre[1].startsWith("/") ? this.baseUrl + genre[1] : genre[1],
                });
            }
            const releaseDateRegex = /Released:[\s\S]*?<\/span>(.*?)<\/p>/;
            const releaseDate = response.match(releaseDateRegex)[1].trim();
            const statusRegex = /Status:[\s\S]*?title=".*">(.*?)</;
            const status = response.match(statusRegex)[1].trim();
            const ohterNamesRegex = /Other name:[\s\S]*?>([\s\S]*?)</;
            const otherNames = response.match(ohterNamesRegex)[1].trim().split(",");
            const episodes = [];
            const episodesRegex = /<li>[\s\S]*?href="\/([\s\S]*?)"[\s\S]*?n>([\s\S]*?)<\/d[\s\S]*?<[\s\S]*?e">([\s\S]*?)</g;
            const episodesList = [...response.matchAll(episodesRegex)];
            for (const episode of episodesList) {
                episodes.push({
                    id: episode[1].trim(),
                    name: episode[2]
                        .replace(openingTagRegex, "")
                        .replace(closingTagRegex, "")
                        .trim(),
                    url: this.baseUrl + "/" + episode[1],
                    language: episode[3].trim().toLowerCase() === "dub" ? "English" : "Sub",
                    number: parseInt(episode[2].toLowerCase().includes("movie")
                        ? "0"
                        : episode[2].trim().split(" ")[1]),
                });
            }
            return {
                id: id,
                name: name,
                description: description,
                imageUrl: imageUrl,
                url: url,
                type: this.sourceType,
                language: language,
                synopsis: synopsis,
                genres: genres,
                media: episodes,
                releaseDate: releaseDate,
                status: status,
                otherNames: otherNames,
            };
        });
    }
    getItemMedia(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.baseUrl}/${id}`;
            const episodePageResponse = yield fetch(url)
                .then((response) => response)
                .then((data) => data.text());
            if (!episodePageResponse) {
                return [];
            }
            var sources = [];
            const $ = (0, cheerio_1.load)(episodePageResponse);
            $(".anime_muti_link ul li").each(function () {
                const source = $(this).find("a").attr("data-video");
                sources.push({
                    type: "ExtractorVideo",
                    url: source,
                    name: source.includes("gogoanime") ? "Gogoanime" : "Unknown",
                    iconUrl: source.includes("gogoanime")
                        ? "https://www13.gogoanimes.fi/favicon.ico"
                        : undefined,
                    headers: {
                        Referer: url,
                    },
                });
            });
            return sources;
        });
    }
}
module.exports = {
    search: (query, page) => __awaiter(void 0, void 0, void 0, function* () { return new GogoanimeOld().search(query, page); }),
    getCategory: (category, page) => __awaiter(void 0, void 0, void 0, function* () { return new GogoanimeOld().getCategory(category, page); }),
    getHomeCategories: () => __awaiter(void 0, void 0, void 0, function* () { return new GogoanimeOld().getHomeCategories(); }),
    getItemDetails: (id) => __awaiter(void 0, void 0, void 0, function* () { return new GogoanimeOld().getItemDetails(id); }),
    getItemMedia: (id) => __awaiter(void 0, void 0, void 0, function* () { return new GogoanimeOld().getItemDetails(id); }),
};
exports.default = GogoanimeOld;
