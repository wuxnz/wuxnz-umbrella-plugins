// import { Cheerio, CheerioAPI } from "cheerio";

// const cheerio = require("cheerio");

class NineAnimePlugin {
  baseUrl = "https://9animetv.to";

  async search(query: string, page?: number) {
    var baseUrl = this.baseUrl;
    const url = `${baseUrl}/search?keyword=${query}&page=${page || 1}`;
    const response = await fetch(url)
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
      item["name"] = $(this).find(".dynamic-name").text().trim();
      item["description"] = $(
        `#qtip-${index}-content > div:nth-child(1) > div:nth-child(7)`
      )
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
  }

  async getCategory(category: string, page?: number): Promise<object> {
    return {};
  }

  async getHomeCategories(): Promise<object[]> {
    return [];
  }

  async getItemDetails(id: string): Promise<object> {
    const baseUrl = this.baseUrl;
    const url = `${baseUrl}/watch/${id}`;
    const response = await fetch(url)
      .then((response) => response)
      .then((data) => data.text());

    if (!response) {
      return {};
    }
    // @ts-expect-error
    const $ = Cheerio.load(response);
    const name = $("h2.film-name").text().trim();
    const imageUrl = $(
      ".anime-poster > div:nth-child(1) > img:nth-child(1)"
    ).attr("src");
    const synopsis = $(".shorting").text().trim();
    var related = [];
    $(
      ".cbox-collapse > div:nth-child(1) > div:nth-child(1) > ul:nth-child(1) > li"
    ).each(function () {
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
        return (
          $(this).find(".item-title").text().trim().toLowerCase() == "type:"
        );
      })
      .find(".item-content")
      .text()
      .trim();
    var genres = [];
    var genresElement = metaInfos.filter(function () {
      return (
        $(this).find(".item-title").text().trim().toLowerCase() == "genre:"
      );
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
      return (
        $(this).find(".item-title").text().trim().toLowerCase() == "premiered:"
      );
    });
    if (releaseDateElement.length > 0) {
      releaseDate = releaseDateElement.find(".item-content").text().trim();
    }
    var rating;
    const ratingElement = metaInfos.filter(function () {
      return (
        $(this).find(".item-title").text().trim().toLowerCase() == "scores:"
      );
    });
    if (ratingElement.length > 0) {
      rating = ratingElement.find(".item-content").text().trim();
    }
    var creators;
    const creatorsElement = metaInfos.filter(function () {
      return (
        $(this).find(".item-title").text().trim().toLowerCase() == "studios:"
      );
    });
    if (creatorsElement.length > 0) {
      creators = creatorsElement.find(".item-content").text().trim();
    }
    var status;
    const statusElement = metaInfos.filter(function () {
      return (
        $(this).find(".item-title").text().trim().toLowerCase() == "status:"
      );
    });
    if (statusElement.length > 0) {
      status = statusElement.find(".item-content").text().trim();
    }
    var otherNames = $(".alias").text().trim().split(", ");

    var episodes = [];
    const episodeResponse = await fetch(
      `${baseUrl}/ajax/episode/list/${id.split("-")[id.split("-").length - 1]}`
    )
      .then((response) => response)
      .then((data) => data.json());
    if (episodeResponse.status === true) {
      const episodeRegex =
        /<a.*?href="([\s\S]*?)"[\s\S]*?title="([\s\S]*?)"[\s\S]*?data-number="([\s\S]*?)[\s\S]*?data-id="([\s\S]*?)">/g;
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
  }

  async getItemMedia(id: string): Promise<object[]> {
    const baseUrl = this.baseUrl;
    const serversUrl = `${baseUrl}/ajax/episode/servers?episodeId=${
      id.split("ep=")[id.split("ep=").length - 1]
    }`;
    const serversResponse = await fetch(serversUrl)
      .then((response) => response)
      .then((data) => data.json());
    const serversRegex =
      /<div[\s\S]*?server-item"[\s\S]*?data-type="([\s\S]*?)"[\s\S]*?data-id="([\s\S]*?)[\s\S]*?<a[\s\S]*?class="btn">([\s\S]*?)</g;
    const servers = [...serversResponse.html.matchAll(serversRegex)].map(
      function (item) {
        return {
          language: item[1].trim(),
          id: item[2].trim(),
          name: item[3].trim(),
        };
      }
    );
    var sources = [];
    for (const server of servers) {
      var source = {};
      const serverUrl = `${baseUrl}/ajax/episode/sources?id=${server.id}`;
      const serverResponse = await fetch(serverUrl)
        .then((response) => response)
        .then((data) => data.json());
      if (
        serverResponse.link != null &&
        serverResponse.link != undefined &&
        serverResponse.link != ""
      ) {
        source["type"] = "ExtractorVideo";
        source["url"] = serverResponse.link;
        source["name"] = server.name + " - " + server.language;
        sources.push(source);
      }
    }
    return sources;
  }
}

module.exports = {
  search: async (query: string, page?: number): Promise<object> =>
    new NineAnimePlugin().search(query, page),
  getCategory: async (category: string, page?: number): Promise<object> =>
    new NineAnimePlugin().getCategory(category, page),
  getHomeCategories: async (): Promise<object[]> =>
    new NineAnimePlugin().getHomeCategories(),
  getItemDetails: async (id: string): Promise<object> =>
    new NineAnimePlugin().getItemDetails(id),
  getItemMedia: async (id: string): Promise<object[]> =>
    new NineAnimePlugin().getItemMedia(id),
};

export default NineAnimePlugin;
