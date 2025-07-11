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
var buffer = require("buffer").Buffer;
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
                // @ts-expect-error
                const $ = Cheerio.load(response);
                var items = [];
                $(".bs").each(function () {
                    var item = {};
                    item["id"] = $(this).find("a").attr("href").split("/")[2];
                    // throw new Error(`${item["id"]}`);
                    item["name"] = $(this).find("div.tt").text().split("<")[0].trim();
                    item["description"] = $(this).find(".typez").text().trim();
                    item["imageUrl"] = $(this).find("img").attr("src");
                    item["url"] = $(this).find("a").attr("href").startsWith("/")
                        ? `${this.baseUrl}${$(this).find("a").attr("href")}`
                        : $(this).find("a").attr("href");
                    item["type"] = "Video";
                    items.push(item);
                });
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
            const nameRegex = /<h1[\s\S]*?>([\s\S]*?)<\/h1>/;
            const name = response.match(nameRegex)[1].trim().replace(/&.*?;/g, "");
            const descriptionRegex = /Type:<\/b>([\s\S]*?)</;
            const description = response.match(descriptionRegex)[1].trim();
            const imageUrlRegex = /<div.*class="thumb"[\s\S]*?<img[\s\S]*?src="(.*?)"/;
            var imageUrl = response.match(imageUrlRegex)[1];
            const language = name.toLocaleLowerCase().includes("(dub)")
                ? "English"
                : "Japanese";
            const synopsisRegex = /<div.*class="entry-content".*itemprop="description">([\s\S]*?)<\/div/;
            var synopsis = response
                .match(synopsisRegex)[1]
                .trim()
                .replace(/&.*?;/g, "");
            const openingTagRegex = /<.*?>/g;
            synopsis = synopsis.replace(openingTagRegex, "");
            const closingTagRegex = /<\/.*?>/g;
            synopsis = synopsis.replace(closingTagRegex, "").trim();
            const genres = [];
            const genresElementRegex = /<div.*class="genxed">[\s\S]*?<\/div/;
            const genresElement = response.match(genresElementRegex) === null
                ? ""
                : response.match(genresElementRegex)[0];
            const genresRegex = /<a[\s\S]*?href="(.*?)"[\s\S]*?>(.*?)<\/a>/g;
            const genresList = [...genresElement.matchAll(genresRegex)];
            for (const genre of genresList) {
                if (genre[1].startsWith("/")) {
                    genre[1] = `${this.baseUrl}/${genre[1]}`;
                }
                genres.push({
                    id: genre[1].split("/")[genre[1].split("/").length - 2],
                    name: genre[2],
                    url: genre[1].startsWith("/") ? this.baseUrl + genre[1] : genre[1],
                });
            }
            const releaseDateRegex = /Released:[\s\S]*?>([\s\S]*?)</;
            const releaseDate = response.match(releaseDateRegex)[1].trim();
            const statusRegex = /Status:.*?>(.*?)</;
            const status = response.match(statusRegex)[1].trim();
            // const nsfwRegex = /Censor:.*?>(.*?)</;
            // const nsfw = response.match(nsfwRegex)[1].trim();
            const episodes = [];
            // const episodeContainerRegex =
            //   /<ul>[\s\S]*?\!--themesia.*?>([\s\S]*?)<\!--themesia.*?>[\s\S]*?<\/ul>/;
            // const episodeContainer = response.match(episodeContainerRegex)[1];
            const episodesRegex = /<a href="(.*?)">[\s\S]*?num">([\s\S]*?)<[\s\S]*?title">([\s\S]*?)</g;
            const episodesList = [...response.matchAll(episodesRegex)].slice(1);
            for (const episode of episodesList) {
                episodes.push({
                    id: episode[1].split("/")[episode[1].split("/").length - 2],
                    name: episode[3].trim(),
                    url: episode[1],
                    language: name.toLocaleLowerCase().includes("(dub)")
                        ? "English"
                        : "Sub",
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
                // nsfw: nsfw,
            };
        });
    }
    getItemMedia(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // throw new Error(id);
            const episodePageResponse = yield fetch(`${this.baseUrl}/${id}/`)
                .then((response) => response)
                .then((data) => data.text());
            if (!episodePageResponse) {
                return [];
            }
            // const base64EmbedLinksRegex = /data-hash="(.*?)">(.*?)</g;
            // const embedLinkRegex = /src="(.*?)"/;
            // const sources = [
            //   ...episodePageResponse.matchAll(base64EmbedLinksRegex),
            // ].map((mat, index) => {
            //   const url = buffer
            //     .from(mat[1], "base64")
            //     .toString("utf-8")
            //     .match(embedLinkRegex)[1];
            //   const sourceName =
            //     mat[2];
            //   return {
            //     type: "ExtractorVideo",
            //     url: url,
            //     name: sourceName,
            //     headers: {
            //       "User-Agent":
            //         "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0",
            //     },
            //   };
            // });
            var sources = [];
            const rawSourcesRegex = /<option[\s\S]*?value="(.+?)"[\s\S]*?>([\s\S]*?)</g;
            const rawSourcesList = [...episodePageResponse.matchAll(rawSourcesRegex)];
            for (const rawSource of rawSourcesList) {
                const rawSourceResponse = yield fetch(rawSource[1])
                    .then((response) => response)
                    .then((data) => data.text());
                const sourceRegex = /<iframe[\s\S]*?src="(.*?)"/;
                const source = rawSourceResponse.match(sourceRegex)[1];
                sources.push({
                    type: "ExtractorVideo",
                    url: source,
                    name: rawSource[2].trim(),
                });
            }
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
