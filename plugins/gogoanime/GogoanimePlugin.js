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
var buffer = require("buffer");
class GogoanimePlugin {
    constructor() {
        this.baseUrl = "https://gogoanimez.to";
        // ajaxUrl = 'https://ajax.gogocdn.net';
        this.sourceType = "Video";
    }
    search(query, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNum = page || 1;
                const url = `${this.baseUrl}/page/${pageNum}/?s=${query}`;
                const response = yield fetch(url)
                    .then((response) => response)
                    .then((data) => data.text());
                if (!response) {
                    return {};
                }
                const ulRegex = /<div.*class="listupd".*>([\s\S]*<\/article>)[\s\S]*?<\/div>/;
                const listUl = response.match(ulRegex)[1];
                const listItemsRegex = /<article[\s\S]*?>([\s\S]*?)<\/article>/g;
                const listItems = [...listUl.matchAll(listItemsRegex)].map((item) => item[1]);
                const items = [];
                const idRegex = /<a[\s\S]*?[\s\S]*?href=".*\/series\/(.*?)\/"/;
                const nameRegex = /url"[\s\S]*?title="([\s\S]*?)"/;
                const descriptionRegex = /class="limit">[\s\S]*?>(.*?)</;
                const imageUrlRegex = /<img[\s\S]*?src="(.*?)"/;
                for (const item of listItems) {
                    const id = item.match(idRegex)[1];
                    const name = item.match(nameRegex)[1];
                    // throw new Error(name);
                    const description = item.match(descriptionRegex)[1].trim() || "";
                    var imageUrl = item.match(imageUrlRegex)[1];
                    items.push({
                        id,
                        name,
                        description,
                        imageUrl,
                        url: url,
                        type: this.sourceType,
                    });
                }
                return {
                    name: "Gogoanime",
                    description: `Search results for ${query}`,
                    url: decodeURIComponent(`${this.baseUrl}/page/${pageNum}/?s=${query}`),
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
        return {};
    }
    getHomeCategories() {
        return [];
    }
    getItemDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.baseUrl}/series/${id}/`;
            const response = yield fetch(url)
                .then((response) => response)
                .then((data) => data.text());
            if (!response) {
                return {};
            }
            const nameRegex = /<h1.*?class="entry-title".*>(.*?)<\/h1>/;
            const name = response.match(nameRegex)[1].trim();
            const descriptionRegex = /Type:.*?>(.*?)</;
            const description = response.match(descriptionRegex)[1].trim();
            const imageUrlRegex = /<div.*class="thumb"[\s\S]*?<img[\s\S]*?src="(.*?)"/;
            var imageUrl = response.match(imageUrlRegex)[1];
            const language = name.includes("(Dub)") ? "English" : "Japanese";
            const synopsisRegex = /<div.*class="entry-content".*itemprop="description">([\s\S]*?)<\/div/;
            var synopsis = response.match(synopsisRegex)[1].trim();
            const openingTagRegex = /<.*?>/g;
            synopsis = synopsis.replace(openingTagRegex, "");
            const closingTagRegex = /<\/.*?>/g;
            synopsis = synopsis.replace(closingTagRegex, "");
            const genres = [];
            const genresElementRegex = /<div.*class="genxed">[\s\S]*?<\/div/;
            const genresElement = response.match(genresElementRegex)[0];
            const genresRegex = /<a href="(.*?)"[\s\S]*?>(.*?)</g;
            const genresList = [...genresElement.matchAll(genresRegex)];
            for (const genre of genresList) {
                if (genre[1].startsWith("/")) {
                    genre[1] = `${this.baseUrl}/${genre[1]}`;
                }
                genres.push({
                    id: genre[1].split("/").pop(),
                    name: genre[2],
                    url: genre[1].startsWith("/") ? this.baseUrl + genre[1] : genre[1],
                });
            }
            const releaseDateRegex = /Released:.*?>(.*?)</;
            const releaseDate = response.match(releaseDateRegex)[1].trim();
            const statusRegex = /Status:.*?>(.*?)</;
            const status = response.match(statusRegex)[1].trim();
            const nsfwRegex = /Censor:.*?>(.*?)</;
            const nsfw = response.match(nsfwRegex)[1].trim();
            const episodes = [];
            // const episodeContainerRegex =
            //   /<ul>[\s\S]*?\!--themesia.*?>([\s\S]*?)<\!--themesia.*?>[\s\S]*?<\/ul>/;
            // const episodeContainer = response.match(episodeContainerRegex)[1];
            const episodesRegex = /<a.*?href="(.*?)".*?class="item.*?ep-item.*?".*?data-number="(.*?)"[\s\S]*?data-id="(.*?)">[\s\S]*?>(.*?)</g;
            const episodesList = [...response.matchAll(episodesRegex)];
            for (const episode of episodesList) {
                episodes.push({
                    id: episode[1].split("/")[episode[1].split("/").length - 2],
                    name: `Episode ${episode[2].trim()}`,
                    url: episode[1],
                    language: name.includes("(Dub)") ? "English" : "Sub",
                    number: parseInt(episode[2].trim()),
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
                nsfw: nsfw,
            };
        });
    }
    getItemMedia(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const episodePageResponse = yield fetch(`${this.baseUrl}/${id}/`)
                .then((response) => response)
                .then((data) => data.text());
            if (!episodePageResponse) {
                return [];
            }
            const base64EmbedLinksRegex = /data-hash="(.*?)">/g;
            const embedLinkRegex = /src="(.*?)"/;
            const sources = [
                ...episodePageResponse.matchAll(base64EmbedLinksRegex),
            ].map((mat, index) => {
                const url = buffer
                    .from(mat[1], "base64")
                    .toString("utf-8")
                    .match(embedLinkRegex)[1];
                const origin = url
                    ? url.match(/http.*:\/\/(.*)\..*/)[1]
                    : "Unknown Source";
                const sourceName = origin.length > 0
                    ? `${index + 1} - ${origin[0].toUpperCase() + origin.slice(1)}`
                    : "Unknown Source";
                return {
                    type: "ExtractorVideo",
                    url: url,
                    name: sourceName,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0",
                    },
                };
            });
            return sources;
        });
    }
}
module.exports = {
    search: (query, page) => __awaiter(this, void 0, void 0, function* () { return new GogoanimePlugin().search(query, page); }),
    getCategory: (category, page) => __awaiter(this, void 0, void 0, function* () { return new GogoanimePlugin().getCategory(category, page); }),
    getHomeCategories: () => __awaiter(this, void 0, void 0, function* () { return new GogoanimePlugin().getHomeCategories(); }),
    getItemDetails: (id) => __awaiter(this, void 0, void 0, function* () { return new GogoanimePlugin().getItemDetails(id); }),
    getItemMedia: (id) => __awaiter(this, void 0, void 0, function* () { return new GogoanimePlugin().getItemMedia(id); }),
};
