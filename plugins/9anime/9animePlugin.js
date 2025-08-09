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
const cheerio = require("cheerio");
class NineAnimePlugin {
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
            const $ = cheerio.load(response); // as CheerioAPI;
            var items = [];
            var index = 0;
            $(".flw-item").each(function () {
                var item = {};
                item["id"] = $(this).find("a").attr("href").split("/")[2];
                item["name"] = $(this).find(".dynamic-name").text().trim();
                item["description"] = $(`#qtip-${index}-content > div:nth-child(1) > div:nth-child(7)`)
                    .text()
                    .trim();
                item["imageUrl"] = $(this).find("img").attr("data-src");
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
            const baseUrl = this.baseUrl;
            const url = `${baseUrl}/home`;
            const response = yield fetch(url)
                .then((response) => response)
                .then((data) => data.text());
            if (!response) {
                return [];
            }
            const $ = cheerio.load(response);
            var categories = [];
            categories.push({
                name: "Featured",
                description: "9anime featured",
                url: url,
                isPaginated: false,
                items: (($) => {
                    var items = [];
                    $("#slider > div:nth-child(1) > div.swiper-slide").each(function () {
                        var item = {};
                        item["id"] = $(this)
                            .find("div.desi-head-title > a")
                            .attr("href")
                            .split("/")[2];
                        item["name"] = $(this).find("div.desi-head-title > a").text().trim();
                        item["description"] = $(this)
                            .find("div.desi-description")
                            .text()
                            .trim();
                        item["imageUrl"] = $(this).find("img").attr("src").startsWith("/")
                            ? `${baseUrl}${$(this).find("img").attr("src")}`
                            : $(this).find("img").attr("src");
                        item["url"] = $(this)
                            .find("div.desi-head-title > a")
                            .attr("href")
                            .startsWith("/")
                            ? `${baseUrl}${$(this)
                                .find("div.desi-head-title > a")
                                .attr("href")}`
                            : $(this).find("div.desi-head-title > a").attr("href");
                        item["type"] = "Video";
                        items.push(item);
                    });
                    return items;
                })($),
            });
            categories.push({
                name: $(".block_area-header-tabs > div:nth-child(1) > h2:nth-child(1)")
                    .text()
                    .trim(),
                description: `9anime ${$(".block_area-header-tabs > div:nth-child(1) > h2:nth-child(1)")
                    .text()
                    .trim()}`,
                url: url,
                isPaginated: false,
                items: (($) => {
                    var items = [];
                    $(".film_list-wrap > div.flw-item").each(function () {
                        var item = {};
                        item["id"] = $(this)
                            .find("h3.film-name > a")
                            .attr("href")
                            .split("/")[2];
                        item["name"] = $(this).find("h3.film-name > a").text().trim();
                        item["description"] = $(this)
                            .find("div.film-poster > div.tick-item")
                            .text()
                            .trim();
                        item["imageUrl"] = $(this)
                            .find("img")
                            .attr("data-src")
                            .startsWith("/")
                            ? `${baseUrl}${$(this).find("img").attr("data-src")}`
                            : $(this).find("img").attr("data-src");
                        item["url"] = $(this)
                            .find("h3.film-name > a")
                            .attr("href")
                            .startsWith("/")
                            ? `${baseUrl}${$(this).find("h3.film-name > a").attr("href")}`
                            : $(this).find("h3.film-name > a").attr("href");
                        item["type"] = "Video";
                        items.push(item);
                    });
                    return items;
                })($),
            });
            function parseMultiCategory($) {
                var categories = [];
                // var categoryItems = [];
                $("div.tab-content > div").each(function () {
                    if (!($(this).find("ul > li").length == 0) &&
                        !($(this).attr("id") == undefined)) {
                        var category = {};
                        category["name"] = $(this)
                            .attr("id")
                            .split("-")
                            .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
                            .join(" ");
                        category["url"] = url;
                        category["isPaginated"] = false;
                        category["items"] = $(this)
                            .find("ul > li")
                            .map(function () {
                            var item = {};
                            item["id"] = $(this).find("a").attr("href").split("/")[2];
                            item["name"] = $(this).find("a").text().trim();
                            item["description"] = $(this)
                                .find("div.fiml-number > span")
                                .text()
                                .trim();
                            item["imageUrl"] = $(this)
                                .find("img")
                                .attr("data-src")
                                .startsWith("/")
                                ? `${baseUrl}${$(this).find("img").attr("data-src")}`
                                : $(this).find("img").attr("data-src");
                            item["url"] = $(this).find("a").attr("href").startsWith("/")
                                ? `${baseUrl}${$(this).find("a").attr("href")}`
                                : $(this).find("a").attr("href");
                            item["type"] = "Video";
                            return item;
                        });
                        categories.push(category);
                    }
                });
                return categories;
            }
            categories.push(...parseMultiCategory($));
            categories.push({
                name: $("section.block_area_sidebar:nth-child(3) > div:nth-child(1) > div:nth-child(1) > h2:nth-child(1)")
                    .text()
                    .trim(),
                description: `9anime ${$("section.block_area_sidebar:nth-child(3) > div:nth-child(1) > div:nth-child(1) > h2:nth-child(1)")
                    .text()
                    .trim()}`,
                url: url,
                isPaginated: false,
                items: (($) => {
                    var items = [];
                    $("section.block_area_sidebar:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > ul:nth-child(1) > li").each(function () {
                        var item = {};
                        item["id"] = $(this)
                            .find("h3.film-name > a")
                            .attr("href")
                            .split("/")[2];
                        item["name"] = $(this).find("h3.film-name > a").text().trim();
                        item["description"] = $(this).find("span.fdi-item").text().trim();
                        item["imageUrl"] = $(this)
                            .find("img")
                            .attr("data-src")
                            .startsWith("/")
                            ? `${baseUrl}${$(this).find("img").attr("data-src")}`
                            : $(this).find("img").attr("data-src");
                        item["url"] = $(this)
                            .find("h3.film-name > a")
                            .attr("href")
                            .startsWith("/")
                            ? `${baseUrl}${$(this).find("h3.film-name > a").attr("href")}`
                            : $(this).find("h3.film-name > a").attr("href");
                        item["type"] = "Video";
                        items.push(item);
                    });
                    return items;
                })($),
            });
            return categories;
        });
    }
    getItemDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseUrl = this.baseUrl;
            const url = `${baseUrl}/watch/${id}`;
            const response = yield fetch(url)
                .then((response) => response)
                .then((data) => data.text());
            if (!response) {
                return {};
            }
            const $ = cheerio.load(response);
            const name = $("h2.film-name").text().trim();
            const imageUrl = $(".anime-poster > div:nth-child(1) > img:nth-child(1)").attr("src");
            const synopsis = $(".shorting").text().trim();
            var related = [];
            $(".cbox-collapse > div:nth-child(1) > div:nth-child(1) > ul:nth-child(1) > li").each(function () {
                var item = {};
                item["id"] = $(this).find("a").attr("href").split("/")[2];
                item["name"] = $(this).find("a").text().trim();
                item["description"] = $(this).find("span").text().trim();
                item["imageUrl"] = $(this).find("img").attr("data-src");
                item["url"] = $(this).find("a").attr("href").startsWith("/")
                    ? `${baseUrl}${$(this).find("a").attr("href")}`
                    : $(this).find("a").attr("href");
                item["type"] = "Video";
                related.push(item);
            });
            const metaInfos = $(".col1 > div");
            const description = metaInfos
                .filter(function () {
                return ($(this).find(".item-title").text().trim().toLowerCase() == "type:");
            })
                .find(".item-content")
                .text()
                .trim();
            var genres = [];
            var genresElement = metaInfos.filter(function () {
                return ($(this).find(".item-title").text().trim().toLowerCase() == "genre:");
            });
            if (genresElement.length > 0) {
                genresElement.find(".item-content > a").each(function () {
                    var genre = {};
                    genre["id"] = $(this).attr("href").split("/")[2];
                    genre["name"] = $(this).text().trim();
                    genre["url"] = $(this).attr("href").startsWith("/")
                        ? `${baseUrl}${$(this).attr("href")}`
                        : $(this).attr("href");
                    genre["isPaginated"] = true;
                    genre["nextPageNumber"] = 1;
                    genre["previousPageNumber"] = undefined;
                    genres.push(genre);
                });
            }
            var releaseDate;
            const releaseDateElement = metaInfos.filter(function () {
                return ($(this).find(".item-title").text().trim().toLowerCase() == "premiered:");
            });
            if (releaseDateElement.length > 0) {
                releaseDate = releaseDateElement.find(".item-content").text().trim();
            }
            var rating;
            const ratingElement = metaInfos.filter(function () {
                return ($(this).find(".item-title").text().trim().toLowerCase() == "scores:");
            });
            if (ratingElement.length > 0) {
                rating = ratingElement.find(".item-content").text().trim();
            }
            var creators;
            const creatorsElement = metaInfos.filter(function () {
                return ($(this).find(".item-title").text().trim().toLowerCase() == "studios:");
            });
            if (creatorsElement.length > 0) {
                creators = creatorsElement.find(".item-content").text().trim();
            }
            var status;
            const statusElement = metaInfos.filter(function () {
                return ($(this).find(".item-title").text().trim().toLowerCase() == "status:");
            });
            if (statusElement.length > 0) {
                status = statusElement.find(".item-content").text().trim();
            }
            var otherNames = $(".alias").text().trim().split(", ");
            var episodes = [];
            const episodeResponse = yield fetch(`${baseUrl}/ajax/episode/list/${id.split("-")[id.split("-").length - 1]}`)
                .then((response) => response)
                .then((data) => data.json());
            if (episodeResponse.status === true) {
                const episodeRegex = /<a.*?href="([\s\S]*?)"[\s\S]*?title="([\s\S]*?)"[\s\S]*?data-number="([\s\S]*?)[\s\S]*?data-id="([\s\S]*?)">/g;
                [...episodeResponse.html.matchAll(episodeRegex)].map(function (item) {
                    episodes.push({
                        id: item[1].split("/")[2],
                        name: item[2].trim(),
                        url: item[1].startsWith("/") ? `${baseUrl}${item[1]}` : item[1],
                        language: "Unknown",
                        number: Number(item[3].trim()),
                    });
                });
            }
            return {
                id: id,
                name: name,
                description: description,
                imageUrl: imageUrl,
                url: url,
                type: "Video",
                language: "Unknown",
                synopsis: synopsis,
                related: related,
                genres: genres,
                media: episodes,
                releaseDate: releaseDate,
                rating: rating,
                creators: creators,
                status: status,
                otherNames: otherNames,
            };
        });
    }
    getItemMedia(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseUrl = this.baseUrl;
            const serversUrl = `${baseUrl}/ajax/episode/servers?episodeId=${id.split("ep=")[1]}`;
            const serversResponse = yield fetch(serversUrl)
                .then((response) => response)
                .then((data) => data.json());
            const serversRegex = /<div[\s\S]*?data-type="([\s\S]*?)"[\s\S]*?data-id="([\s\S]*?)"[\s\S]*?btn">([\s\S]*?)</g;
            const servers = [...serversResponse.html.matchAll(serversRegex)].map(function (item) {
                return {
                    language: item[1][0].trim().toUpperCase() + item[1].trim().slice(1),
                    id: item[2].trim(),
                    name: item[3].trim(),
                };
            });
            var sources = [];
            for (const server of servers) {
                var source = {};
                const serverUrl = `${baseUrl}/ajax/episode/sources?id=${server.id}`;
                const serverResponse = yield fetch(serverUrl)
                    .then((response) => response)
                    .then((data) => data.json());
                if (serverResponse.link != null &&
                    serverResponse.link != undefined &&
                    serverResponse.link != "") {
                    source["type"] = "ExtractorVideo";
                    source["url"] = serverResponse.link;
                    source["name"] = server.name + " - " + server.language;
                    sources.push(source);
                }
            }
            return sources;
        });
    }
}
module.exports = {
    search: (query, page) => __awaiter(void 0, void 0, void 0, function* () { return new NineAnimePlugin().search(query, page); }),
    getCategory: (category, page) => __awaiter(void 0, void 0, void 0, function* () { return new NineAnimePlugin().getCategory(category, page); }),
    getHomeCategories: () => __awaiter(void 0, void 0, void 0, function* () { return new NineAnimePlugin().getHomeCategories(); }),
    getItemDetails: (id) => __awaiter(void 0, void 0, void 0, function* () { return new NineAnimePlugin().getItemDetails(id); }),
    getItemMedia: (id) => __awaiter(void 0, void 0, void 0, function* () { return new NineAnimePlugin().getItemMedia(id); }),
};
exports.default = NineAnimePlugin;
