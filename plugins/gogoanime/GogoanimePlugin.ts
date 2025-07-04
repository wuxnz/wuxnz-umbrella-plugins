// Include ts-nocheck here if using modules that arent builtin to node
// Also delete any imports from this file. Use require() instead
//This is an example plugin. Do not use in production.
// Functions' return types are placeholders
// Actual types are in models/ folder
// Refer to models/ContentService.ts

var buffer = require("buffer").Buffer;
class GogoanimePlugin {
  baseUrl = "https://gogoanimez.to";
  // ajaxUrl = 'https://ajax.gogocdn.net';
  sourceType = "Video";
  async search(query, page) {
    try {
      const pageNum = page || 1;
      const url = `${this.baseUrl}/page/${pageNum}/?s=${query}`;
      const response = await fetch(url)
        .then((response) => response)
        .then((data) => data.text());
      if (!response) {
        return {};
      }
      const ulRegex = /listupd">([\s\S]*<\/article>)/;
      var listUl;
      try {
        listUl = response.match(ulRegex)[1];
      } catch (error) {
        return {
          name: "Gogoanime",
          description: `Search results for ${query}`,
          url: decodeURIComponent(
            `${this.baseUrl}/page/${pageNum}/?s=${query}`
          ),
          isPaginated: true,
          nextPageNumber: page + 1,
          previousPageNumber: page > 1 ? page - 1 : undefined,
          items: [],
        };
      }
      const listItemsRegex = /<article[\s\S]*?>([\s\S]*?)<\/article>/g;
      const listItems = [...listUl.matchAll(listItemsRegex)].map(
        (item) => item[1]
      );
      const items = [];
      const idRegex = /<a[\s\S]*?href=".*\/anime\/(.*?)\/"/;
      const nameRegex = /url"[\s\S]*?title="([\s\S]*?)"/;
      const descriptionRegex = /limit">[\s\S]*?>([\s\S]*?)</;
      const imageUrlRegex = /<img[\s\S]*?src="(.*?)"/;
      for (const item of listItems) {
        const id = item.match(idRegex)[1];
        const name = item.match(nameRegex)[1].replace(/&.*?;/g, "");
        // throw new Error(name);
        const description =
          item.match(descriptionRegex) === null
            ? ""
            : item.match(descriptionRegex)[1];
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
    } catch (err) {
      throw err;
    }
  }
  getCategory(category, page) {
    return {};
  }
  getHomeCategories() {
    return [];
  }
  async getItemDetails(id) {
    const url = `${this.baseUrl}/series/${id}/`;
    const response = await fetch(url)
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
    const synopsisRegex =
      /<div.*class="entry-content".*itemprop="description">([\s\S]*?)<\/div/;
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
    const genresElement =
      response.match(genresElementRegex) === null
        ? ""
        : response.match(genresElementRegex)[0];
    const genresRegex = /<a[\s\S]*?href="(.*?)"[\s\S]*?>(.*?)<\/a>/g;
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
    const episodesRegex =
      /<a[\s\S]*?href="(.*?)"[\s\S]*?data-number="(.*?)"[\s\S]*?data-id="(.*?)"[\s\S]*?order">(.*)</g;
    const episodesList = [...response.matchAll(episodesRegex)];
    for (const episode of episodesList) {
      episodes.push({
        id: episode[1].split("/")[episode[1].split("/").length - 2],
        name: `Episode ${episode[2].trim()}`,
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
  }
  async getItemMedia(id) {
    // throw new Error(id);
    const episodePageResponse = await fetch(`${this.baseUrl}/${id}/`)
      .then((response) => response)
      .then((data) => data.text());
    if (!episodePageResponse) {
      return [];
    }
    const base64EmbedLinksRegex = /data-hash="(.*?)">(.*?)</g;
    const embedLinkRegex = /src="(.*?)"/;
    const sources = [
      ...episodePageResponse.matchAll(base64EmbedLinksRegex),
    ].map((mat, index) => {
      const url = buffer
        .from(mat[1], "base64")
        .toString("utf-8")
        .match(embedLinkRegex)[1];
      // const origin = url
      //   ? url.match(/http.*:\/\/(.*)\..*/)[1]
      //   : "Unknown Source";
      const sourceName =
        // origin.length > 0
        //   ? `${index + 1} - ${origin[0].toUpperCase() + origin.slice(1)}`
        //   : "Unknown Source";
        mat[2];
      return {
        type: "ExtractorVideo",
        url: url,
        name: sourceName,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0",
        },
      };
    });
    return sources;
  }
}

module.exports = {
  search: async (query: string, page?: number) =>
    new GogoanimePlugin().search(query, page),
  getCategory: async (category: string, page?: number) =>
    new GogoanimePlugin().getCategory(category, page),
  getHomeCategories: async () => new GogoanimePlugin().getHomeCategories(),
  getItemDetails: async (id: string) =>
    new GogoanimePlugin().getItemDetails(id),
  getItemMedia: async (id: string) => new GogoanimePlugin().getItemMedia(id),
};
