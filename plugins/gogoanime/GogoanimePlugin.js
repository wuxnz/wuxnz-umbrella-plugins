// Include ts-nocheck here if using modules that arent builtin to node
// Also delete any imports from this file. Use require() instead
//This is an example plugin. Do not use in production.
// Functions' return types are placeholders
// Actual types are in models/ folder
// Refer to models/ContentService.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
var buffer = require("buffer").Buffer;
var GogoanimePlugin = /** @class */ (function () {
    function GogoanimePlugin() {
        this.baseUrl = "https://gogoanimez.to";
        // ajaxUrl = 'https://ajax.gogocdn.net';
        this.sourceType = "Video";
    }
    GogoanimePlugin.prototype.search = function (query, page) {
        return __awaiter(this, void 0, void 0, function () {
            var pageNum, url, response, ulRegex, listUl, listItemsRegex, listItems, items, idRegex, nameRegex, descriptionRegex, imageUrlRegex, _i, listItems_1, item, id, name_1, description, imageUrl, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        pageNum = page || 1;
                        url = "".concat(this.baseUrl, "/page/").concat(pageNum, "/?s=").concat(query);
                        return [4 /*yield*/, fetch(url)
                                .then(function (response) { return response; })
                                .then(function (data) { return data.text(); })];
                    case 1:
                        response = _a.sent();
                        if (!response) {
                            return [2 /*return*/, {}];
                        }
                        ulRegex = /listupd">([\s\S]*<\/article>)/;
                        try {
                            listUl = response.match(ulRegex)[1];
                        }
                        catch (error) {
                            return [2 /*return*/, {
                                    name: "Gogoanime",
                                    description: "Search results for ".concat(query),
                                    url: decodeURIComponent("".concat(this.baseUrl, "/page/").concat(pageNum, "/?s=").concat(query)),
                                    isPaginated: true,
                                    nextPageNumber: page + 1,
                                    previousPageNumber: page > 1 ? page - 1 : undefined,
                                    items: [],
                                }];
                        }
                        listItemsRegex = /<article[\s\S]*?>([\s\S]*?)<\/article>/g;
                        listItems = __spreadArray([], listUl.matchAll(listItemsRegex), true).map(function (item) { return item[1]; });
                        items = [];
                        idRegex = /<a[\s\S]*?href=".*\/anime\/(.*?)\/"/;
                        nameRegex = /url"[\s\S]*?title="([\s\S]*?)"/;
                        descriptionRegex = /limit">[\s\S]*?>([\s\S]*?)</;
                        imageUrlRegex = /<img[\s\S]*?src="(.*?)"/;
                        for (_i = 0, listItems_1 = listItems; _i < listItems_1.length; _i++) {
                            item = listItems_1[_i];
                            id = item.match(idRegex)[1];
                            name_1 = item.match(nameRegex)[1].replace(/&.*?;/g, "");
                            description = item.match(descriptionRegex) === null
                                ? ""
                                : item.match(descriptionRegex)[1];
                            imageUrl = item.match(imageUrlRegex)[1];
                            items.push({
                                id: id,
                                name: name_1,
                                description: description,
                                imageUrl: imageUrl,
                                url: url,
                                type: this.sourceType,
                            });
                        }
                        return [2 /*return*/, {
                                name: "Gogoanime",
                                description: "Search results for ".concat(query),
                                url: decodeURIComponent("".concat(this.baseUrl, "/page/").concat(pageNum, "/?s=").concat(query)),
                                isPaginated: true,
                                nextPageNumber: page + 1,
                                previousPageNumber: page > 1 ? page - 1 : undefined,
                                items: items,
                            }];
                    case 2:
                        err_1 = _a.sent();
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GogoanimePlugin.prototype.getCategory = function (category, page) {
        return {};
    };
    GogoanimePlugin.prototype.getHomeCategories = function () {
        return [];
    };
    GogoanimePlugin.prototype.getItemDetails = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response, nameRegex, name, descriptionRegex, description, imageUrlRegex, imageUrl, language, synopsisRegex, synopsis, openingTagRegex, closingTagRegex, genres, genresElementRegex, genresElement, genresRegex, genresList, _i, genresList_1, genre, releaseDateRegex, releaseDate, statusRegex, status, episodes, episodesRegex, episodesList, _a, episodesList_1, episode;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = "".concat(this.baseUrl, "/series/").concat(id, "/");
                        return [4 /*yield*/, fetch(url)
                                .then(function (response) { return response; })
                                .then(function (data) { return data.text(); })];
                    case 1:
                        response = _b.sent();
                        if (!response) {
                            return [2 /*return*/, {}];
                        }
                        nameRegex = /<h1[\s\S]*?>([\s\S]*?)<\/h1>/;
                        name = response.match(nameRegex)[1].trim().replace(/&.*?;/g, "");
                        descriptionRegex = /Type:<\/b>([\s\S]*?)</;
                        description = response.match(descriptionRegex)[1].trim();
                        imageUrlRegex = /<div.*class="thumb"[\s\S]*?<img[\s\S]*?src="(.*?)"/;
                        imageUrl = response.match(imageUrlRegex)[1];
                        language = name.toLocaleLowerCase().includes("(dub)")
                            ? "English"
                            : "Japanese";
                        synopsisRegex = /<div.*class="entry-content".*itemprop="description">([\s\S]*?)<\/div/;
                        synopsis = response
                            .match(synopsisRegex)[1]
                            .trim()
                            .replace(/&.*?;/g, "");
                        openingTagRegex = /<.*?>/g;
                        synopsis = synopsis.replace(openingTagRegex, "");
                        closingTagRegex = /<\/.*?>/g;
                        synopsis = synopsis.replace(closingTagRegex, "").trim();
                        genres = [];
                        genresElementRegex = /<div.*class="genxed">[\s\S]*?<\/div/;
                        genresElement = response.match(genresElementRegex) === null
                            ? ""
                            : response.match(genresElementRegex)[0];
                        genresRegex = /<a[\s\S]*?href="(.*?)"[\s\S]*?>(.*?)<\/a>/g;
                        genresList = __spreadArray([], genresElement.matchAll(genresRegex), true);
                        for (_i = 0, genresList_1 = genresList; _i < genresList_1.length; _i++) {
                            genre = genresList_1[_i];
                            if (genre[1].startsWith("/")) {
                                genre[1] = "".concat(this.baseUrl, "/").concat(genre[1]);
                            }
                            genres.push({
                                id: genre[1].split("/").pop(),
                                name: genre[2],
                                url: genre[1].startsWith("/") ? this.baseUrl + genre[1] : genre[1],
                            });
                        }
                        releaseDateRegex = /Released:[\s\S]*?>([\s\S]*?)</;
                        releaseDate = response.match(releaseDateRegex)[1].trim();
                        statusRegex = /Status:.*?>(.*?)</;
                        status = response.match(statusRegex)[1].trim();
                        episodes = [];
                        episodesRegex = /<a[\s\S]*?href="(.*?)"[\s\S]*?data-number="(.*?)"[\s\S]*?data-id="(.*?)"[\s\S]*?order">(.*)</g;
                        episodesList = __spreadArray([], response.matchAll(episodesRegex), true);
                        for (_a = 0, episodesList_1 = episodesList; _a < episodesList_1.length; _a++) {
                            episode = episodesList_1[_a];
                            episodes.push({
                                id: episode[1].split("/")[episode[1].split("/").length - 2],
                                name: "Episode ".concat(episode[2].trim()),
                                url: episode[1],
                                language: name.toLocaleLowerCase().includes("(dub)")
                                    ? "English"
                                    : "Sub",
                                number: parseInt(episode[2].trim()),
                            });
                        }
                        return [2 /*return*/, {
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
                                // nsfw: nsfw,
                            }];
                }
            });
        });
    };
    GogoanimePlugin.prototype.getItemMedia = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var episodePageResponse, base64EmbedLinksRegex, embedLinkRegex, sources;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(this.baseUrl, "/").concat(id, "/"))
                            .then(function (response) { return response; })
                            .then(function (data) { return data.text(); })];
                    case 1:
                        episodePageResponse = _a.sent();
                        if (!episodePageResponse) {
                            return [2 /*return*/, []];
                        }
                        base64EmbedLinksRegex = /data-hash="(.*?)">(.*?)</g;
                        embedLinkRegex = /src="(.*?)"/;
                        sources = __spreadArray([], episodePageResponse.matchAll(base64EmbedLinksRegex), true).map(function (mat, index) {
                            var url = buffer
                                .from(mat[1], "base64")
                                .toString("utf-8")
                                .match(embedLinkRegex)[1];
                            // const origin = url
                            //   ? url.match(/http.*:\/\/(.*)\..*/)[1]
                            //   : "Unknown Source";
                            var sourceName = 
                            // origin.length > 0
                            //   ? `${index + 1} - ${origin[0].toUpperCase() + origin.slice(1)}`
                            //   : "Unknown Source";
                            mat[2];
                            return {
                                type: "ExtractorVideo",
                                url: url,
                                name: sourceName,
                                headers: {
                                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0",
                                },
                            };
                        });
                        return [2 /*return*/, sources];
                }
            });
        });
    };
    return GogoanimePlugin;
}());
module.exports = {
    search: function (query, page) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, new GogoanimePlugin().search(query, page)];
    }); }); },
    getCategory: function (category, page) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, new GogoanimePlugin().getCategory(category, page)];
    }); }); },
    getHomeCategories: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, new GogoanimePlugin().getHomeCategories()];
    }); }); },
    getItemDetails: function (id) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, new GogoanimePlugin().getItemDetails(id)];
    }); }); },
    getItemMedia: function (id) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, new GogoanimePlugin().getItemMedia(id)];
    }); }); },
};
