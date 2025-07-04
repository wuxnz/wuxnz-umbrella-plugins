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
// Include ts-nocheck here if using modules that arent builtin to node
// Also delete any imports from this file. Use require() instead
//This is an example plugin. Do not use in production.
// Functions' return types are placeholders
// Actual types are in models/ folder
// Refer to models/ContentService.ts
var GogoanimePluginOld = /** @class */ (function () {
    function GogoanimePluginOld() {
        this.baseUrl = "https://ww31.gogoanimes.fi";
        //   ajaxUrl = "https://ajax.gogocdn.net";
        this.sourceType = "Video";
    }
    GogoanimePluginOld.prototype.search = function (query, page) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response, ulRegex, listUl, listItemsRegex, listItems, items, idRegex, nameRegex, descriptionRegex, imageUrlRegex, _i, listItems_1, item, id, name_1, description, imageUrl, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        url = "".concat(this.baseUrl, "/search?keyword=").concat(query, "&page=").concat(page || 1);
                        return [4 /*yield*/, fetch(url)
                                .then(function (response) { return response; })
                                .then(function (data) { return data.text(); })];
                    case 1:
                        response = _a.sent();
                        if (!response) {
                            return [2 /*return*/, {}];
                        }
                        ulRegex = /<ul.*class="items".*>([\s\S]*?)<\/ul>/;
                        listUl = response.match(ulRegex)[1];
                        listItemsRegex = /<li>([\s\S]*?)<\/li>/g;
                        listItems = __spreadArray([], listUl.matchAll(listItemsRegex), true).map(function (item) { return item[1]; });
                        items = [];
                        idRegex = /<a href="\/category\/(.*?)" title=".*?">/;
                        nameRegex = /<a href="\/category\/.*?" title="(.*?)">/;
                        descriptionRegex = /(Released: .*?)<\/p>/;
                        imageUrlRegex = /<img src="(.*?)".*alt=".*?"[\s\S]*?>/;
                        for (_i = 0, listItems_1 = listItems; _i < listItems_1.length; _i++) {
                            item = listItems_1[_i];
                            id = item.match(idRegex)[1];
                            name_1 = item.match(nameRegex)[1];
                            description = item.match(descriptionRegex)[1].trim();
                            imageUrl = item.match(imageUrlRegex)[1];
                            if (imageUrl.startsWith("/")) {
                                imageUrl = "".concat(this.baseUrl, "/").concat(imageUrl);
                            }
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
                                url: decodeURIComponent("".concat(this.baseUrl, "/search.html?keyword=").concat(query, "&page=").concat(page)),
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
    GogoanimePluginOld.prototype.getCategory = function (category, page) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {}];
            });
        });
    };
    GogoanimePluginOld.prototype.getHomeCategories = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, []];
            });
        });
    };
    GogoanimePluginOld.prototype.getItemDetails = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response, nameRegex, name, descriptionRegex, description, imageUrlRegex, imageUrl, language, synopsisRegex, synopsis, openingTagRegex, closingTagRegex, genres, genresElementRegex, genresElement, genresRegex, genresList, _i, genresList_1, genre, releaseDateRegex, releaseDate, statusRegex, status, ohterNamesRegex, otherNames, lastEpisodeNumber, movieIdRegex, movieId, defaultEpRegex, defaultEp, aliasRegex, alias, episodes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.baseUrl, "/category/").concat(id);
                        return [4 /*yield*/, fetch(url)
                                .then(function (response) { return response; })
                                .then(function (data) { return data.text(); })];
                    case 1:
                        response = _a.sent();
                        if (!response) {
                            return [2 /*return*/, {}];
                        }
                        nameRegex = /<h1>(.*?)<\/h1>/;
                        name = response.match(nameRegex)[1].trim();
                        descriptionRegex = /<p class="type">[\s\S]*?<span>Type:.*<\/span>[\s\s]*?<a href=.*>(.*)<\/a>/;
                        description = response.match(descriptionRegex)[1].trim();
                        imageUrlRegex = /<div class="anime_info_body_bg">[\s\S]*?<img src="(.*?)"/;
                        imageUrl = response.match(imageUrlRegex)[1];
                        if (imageUrl.startsWith("/")) {
                            imageUrl = "".concat(this.baseUrl, "/").concat(imageUrl);
                        }
                        language = name.includes("(Dub)") ? "English" : "Japanese";
                        synopsisRegex = /<div class="description">([\s\S]*?)<\/div>/;
                        synopsis = response.match(synopsisRegex)[1].trim();
                        openingTagRegex = /<.*?>/g;
                        synopsis = synopsis.replace(openingTagRegex, "");
                        closingTagRegex = /<\/.*?>/g;
                        synopsis = synopsis.replace(closingTagRegex, "");
                        genres = [];
                        genresElementRegex = /Genre:.*<\/span>[\s\S]*?<\/p>/;
                        genresElement = response.match(genresElementRegex)[0];
                        genresRegex = /<a href="(.*?)" title="(.*?)">.*?/g;
                        genresList = __spreadArray([], genresElement.matchAll(genresRegex), true);
                        for (_i = 0, genresList_1 = genresList; _i < genresList_1.length; _i++) {
                            genre = genresList_1[_i];
                            if (genre[1].startsWith("/")) {
                                genre[1] = "".concat(this.baseUrl, "/").concat(genre[1]);
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
                        releaseDateRegex = /<p class="type">[\s\S]*<span>Released:[\s\S]*?<\/span>(.*?)<\/p>/;
                        releaseDate = response.match(releaseDateRegex)[1].trim();
                        statusRegex = /Status:[\s\S]*?<\/span>[\s\S]*?<a href=".*?">(.*?)<\/a>/;
                        status = response.match(statusRegex)[1].trim();
                        ohterNamesRegex = /<p class="type other-name">[\s\S]*<span>Other name:[\s\S]*?<\/span>[\s\S]*?<a.* title="(.*?)<\/a>[\s\S]*?<\/p>/;
                        otherNames = response.match(ohterNamesRegex)[1].trim().split(",");
                        lastEpisodeNumber = 10000;
                        movieIdRegex = /value="(.*?)" id="movie_id" class="movie_id"/;
                        movieId = response.match(movieIdRegex)[1];
                        defaultEpRegex = /value="(.*?)" id="default_ep" class="default_ep"/;
                        defaultEp = response.match(defaultEpRegex)[1];
                        aliasRegex = /value="(.*?)" id="alias_anime" class="alias_anime"/;
                        alias = response.match(aliasRegex)[1];
                        episodes = [];
                        // const episodesUrl = `${this.ajaxUrl}/ajax/load-list-episode?ep_start=0&ep_end=${lastEpisodeNumber}&id=${movieId}&default_ep=${defaultEp}&alias=${alias}`;
                        // const episodesResponse = await fetch(episodesUrl)
                        //   .then((response) => response)
                        //   .then((data) => data.text());
                        // if (!episodesResponse) {
                        //   return {
                        //     id: id,
                        //     name: name,
                        //     description: description,
                        //     imageUrl: imageUrl,
                        //     url: url,
                        //     type: this.sourceType,
                        //     language: language,
                        //     synopsis: synopsis,
                        //     genres: genres,
                        //     media: episodes,
                        //     releaseDate: releaseDate,
                        //     status: status,
                        //     otherNames: otherNames,
                        //   };
                        // } else {
                        //   const episodesRegex =
                        //     /<a href="([\s\S* ]*?)"[\s\S]*?class.*>[\s\S]*?<div class="name"><span>(.*?)<\/span>([\s\S]*?)<\/div>[\s\S]*?<div class="cate">(.*)?<\/div>/g;
                        //   const episodesList = [...episodesResponse.matchAll(episodesRegex)];
                        //   for (const episode of episodesList) {
                        //     episodes.push({
                        //       id: episode[1].split("/").pop(),
                        //       name: `${episode[2]} ${episode[3]}`.trim(),
                        //       url: episode[1].startsWith("/")
                        //         ? this.baseUrl + episode[1]
                        //         : episode[1],
                        //       language:
                        //         episode[4].trim().toLowerCase() === "english"
                        //           ? "English"
                        //           : "Japanese",
                        //       number: parseInt(episode[3].trim()),
                        //     });
                        //   }
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
                                otherNames: otherNames,
                            }];
                }
            });
        });
    };
    //   }
    // async vidHideExtractor(url) {
    //         const response = await fetch(url, {
    //             headers: {
    //                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
    //                 Referer: url,
    //             },
    //         })
    //             .then(response => response)
    //             .then(data => data.text());
    //         if (!response) {
    //             return null;
    //         }
    //         const scriptRegex = /eval([\s\S]*?)<\/script>/;
    //         const script = response.match(scriptRegex)[1];
    //         const urlSchemeRegex = /http./;
    //         var urlScheme = script.match(urlSchemeRegex)[0];
    //         if (urlScheme.endsWith('|')) {
    //             urlScheme = urlScheme.slice(0, -1);
    //         }
    //         const sAndFRegex = /data\|+([0-9]*)\|+([0-9]*)/;
    //         const s = script.match(sAndFRegex)[1];
    //         const f = script.match(sAndFRegex)[2];
    //         const srvRegex = /file\|+[0-9]*\|(.*?)\|/;
    //         const srv = script.match(srvRegex)[1];
    //         const iRegex = /i=([0-9\.]*)&/;
    //         const i = script.match(iRegex)[1];
    //         const asnRegex = /text\|+([0-9]*)\|/;
    //         const asn = script.match(asnRegex)[1];
    //         const domainEndRegex = /logo\|+(.*?)\|/;
    //         const domainEnd = script.match(domainEndRegex)[1];
    //         const infoChunkStart = script.split('|width|')[1];
    //         const infoChunkEnd = infoChunkStart.split('|sources|')[0];
    //         const infoChunkSplit = infoChunkEnd.split('|').reverse();
    //         const infoChunkOffset = infoChunkSplit[2] === 'hls2' ? 0 : 1;
    //         const m3u8Index = infoChunkSplit.indexOf('m3u8');
    //         const origin = `${urlScheme}://${infoChunkSplit[0]}.${infoChunkSplit[1]}${infoChunkOffset === 0 ? '' : '-' + infoChunkSplit[2]}.${domainEnd}/${infoChunkSplit[infoChunkOffset + 2]}`;
    //         var urlset = '/';
    //         if (origin.includes('urlset')) {
    //             urlset = ',l,n,h,.urlset/';
    //         }
    //         var t;
    //         var e;
    //         if (infoChunkSplit[m3u8Index + 2] === '129600') {
    //             t = infoChunkSplit[m3u8Index + 1];
    //             e = infoChunkSplit[m3u8Index + 2];
    //         }
    //         else {
    //             t = infoChunkSplit[m3u8Index + 2] + '-' + infoChunkSplit[m3u8Index + 1];
    //             e = infoChunkSplit[m3u8Index + 3];
    //         }
    //         const videoUrl = `${origin}/${infoChunkSplit[infoChunkOffset + 3]}/${infoChunkSplit[infoChunkOffset + 4]}/${infoChunkSplit[infoChunkOffset + 5]}${urlset}master.m3u8?t=${t}&s=${s}&e=129600&f=${f}&srv=${srv}&i=${i}&sp=${infoChunkSplit[infoChunkSplit.indexOf('sp') + 1]}&p1=${srv}&p2=${srv}&asn=${asn}`;
    //         return videoUrl;
    // }
    GogoanimePluginOld.prototype.getItemMedia = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var episodePageResponse, allUlRegex, ul, ulText, embedInfoRegex, embedInfoList;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(this.baseUrl, "/").concat(id))
                            .then(function (response) { return response; })
                            .then(function (data) { return data.text(); })];
                    case 1:
                        episodePageResponse = _a.sent();
                        if (!episodePageResponse) {
                            return [2 /*return*/, []];
                        }
                        allUlRegex = /<ul>[\s\S]*?<\/ul>/g;
                        ul = __spreadArray([], episodePageResponse.matchAll(allUlRegex), true).filter(function (item) {
                            return item[0].includes("data-video");
                        });
                        if (ul.length !== 1) {
                            return [2 /*return*/, []];
                        }
                        ulText = ul[0][0];
                        embedInfoRegex = /<li class=".*">[\s\S]*?<a.*data-video="(.*?)".*>[\s\S]*?<i class="iconlayer-(.*?)">?<\/i>(.*)<span>/g;
                        embedInfoList = __spreadArray([], ulText.matchAll(embedInfoRegex), true).map(function (item) { return ({
                            type: "ExtractorVideo",
                            url: new URL(item[1]),
                            name: item[3],
                            iconUrl: "".concat(_this.baseUrl, "img/").concat(item[2], ".png"),
                        }); });
                        return [2 /*return*/, embedInfoList];
                }
            });
        });
    };
    return GogoanimePluginOld;
}());
module.exports = {
    search: function (query, page) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, new GogoanimePluginOld().search(query, page)];
    }); }); },
    getCategory: function (category, page) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, new GogoanimePluginOld().getCategory(category, page)];
    }); }); },
    getHomeCategories: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, new GogoanimePluginOld().getHomeCategories()];
    }); }); },
    getItemDetails: function (id) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, new GogoanimePluginOld().getItemDetails(id)];
    }); }); },
    getItemMedia: function (id) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, new GogoanimePluginOld().getItemDetails(id)];
    }); }); },
};
