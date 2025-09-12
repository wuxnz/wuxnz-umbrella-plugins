import { type CheerioAPI, load } from 'cheerio';
// import SourceType from '../../models/source/SourceType';
// import MediaType from '../../models/media/MediaType';
// import Category from '../../models/item/Category';
// import DetailedItem from '../../models/item/DetailedItem';
// import ExtractorAudio from '../../models/media/ExtractorAudio';
// import ExtractorVideo from '../../models/media/ExtractorVideo';
// import RawAudio from '../../models/media/RawAudio';
// import RawVideo from '../../models/media/RawVideo';
// import ItemMedia from '../../models/item/ItemMedia';
// import Item from '../../models/item/Item';
// import ContentService from '../../models/ContentService';
// import Genre from '../../models/item/Genre';

import {
  SourceType,
  MediaType,
  Category,
  DetailedItem,
  ExtractorAudio,
  ExtractorVideo,
  RawAudio,
  RawVideo,
  ItemMedia,
  Item,
  ContentService,
  Genre
} from '../../models';

class NineAnimePlugin implements ContentService {
  baseUrl = "https://9animetv.to";

  async search(query: string, page?: number): Promise<Category> {
    var baseUrl = this.baseUrl;
    const url = `${baseUrl}/search?keyword=${query}&page=${page || 1}`;
    const response = await fetch(url)
      .then((response) => response)
      .then((data) => data.text());
    if (!response) {
      return {} as Category;
    }
    const $ = load(response);
    var items: Item[] = [];
    var index = 0;
    $(".flw-item").each(function () {
      var item: Partial<Item> = {};
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
      item["type"] = SourceType.Video;
      items.push(item as Item);
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
    } as Category;
  }

  async getCategory(category: string, page?: number): Promise<Category> {
    return {} as Category;
  }

  async getHomeCategories(): Promise<Category[]> {
    const baseUrl = this.baseUrl;
    const url = `${baseUrl}/home`;
    const response = await fetch(url)
      .then((response) => response)
      .then((data) => data.text());
    if (!response) {
      return [] as Category[];
    }
    const $ = load(response);

    var categories: Category[] = [];

    categories.push({
      name: "Featured",
      description: "9anime featured",
      url: url,
      isPaginated: false,
      items: (($: any) => {
        var items: Item[] = [];
        $("#slider > div:nth-child(1) > div.swiper-slide").each(function () {
          var item: Partial<Item> = {};
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
          item["type"] = SourceType.Video;
          items.push(item as Item);
        });
        return items;
      })($),
    });

    categories.push({
      name: $(".block_area-header-tabs > div:nth-child(1) > h2:nth-child(1)")
        .text()
        .trim(),
      description: `9anime ${$(
        ".block_area-header-tabs > div:nth-child(1) > h2:nth-child(1)"
      )
        .text()
        .trim()}`,
      url: url,
      isPaginated: false,
      items: (($: any) => {
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
        return items as Item[];
      })($),
    } as Category);

    function parseMultiCategory($: any) {
      var categories: Category[] = [];
      // var categoryItems = [];
      $("div.tab-content > div").each(function () {
        if (
          !($(this).find("ul > li").length == 0) &&
          !($(this).attr("id") == undefined)
        ) {
          var category: Partial<Category> = {};
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
              var item: Partial<Item> = {};
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
              item["type"] = SourceType.Video;
              return item;
            });
          categories.push(category as Category);
        }
      });
      return categories as Category[];
    }

    categories.push(...parseMultiCategory($));

    categories.push({
      name: $(
        "section.block_area_sidebar:nth-child(3) > div:nth-child(1) > div:nth-child(1) > h2:nth-child(1)"
      )
        .text()
        .trim(),
      description: `9anime ${$(
        "section.block_area_sidebar:nth-child(3) > div:nth-child(1) > div:nth-child(1) > h2:nth-child(1)"
      )
        .text()
        .trim()}`,
      url: url,
      isPaginated: false,
      items: (($: any) => {
        var items: Item[] = [];
        $(
          "section.block_area_sidebar:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > ul:nth-child(1) > li"
        ).each(function () {
          var item: Partial<Item> = {};
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
          item["type"] = SourceType.Video;
          items.push(item as Item);
        });
        return items as Item[];
      })($),
    } as Category);

    return categories;
  }

  async getItemDetails(id: string): Promise<DetailedItem> {
    const baseUrl = this.baseUrl;
    const url = `${baseUrl}/watch/${id}`;
    const response = await fetch(url)
      .then((response) => response)
      .then((data) => data.text());

    if (!response) {
      return {} as DetailedItem;
    }
    const $ = load(response);
    const name = $("h2.film-name").text().trim();
    const imageUrl = $(
      ".anime-poster > div:nth-child(1) > img:nth-child(1)"
    ).attr("src");
    const synopsis = $(".shorting").text().trim();
    var related: Item[] = [];
    $(
      ".cbox-collapse > div:nth-child(1) > div:nth-child(1) > ul:nth-child(1) > li"
    ).each(function () {
      var item: Partial<Item> = {};
      item["id"] = $(this).find("a").attr("href").split("/")[2];
      item["name"] = $(this).find("a").text().trim();
      item["description"] = $(this).find("span").text().trim();
      item["imageUrl"] = $(this).find("img").attr("data-src");
      item["url"] = $(this).find("a").attr("href").startsWith("/")
        ? `${baseUrl}${$(this).find("a").attr("href")}`
        : $(this).find("a").attr("href");
      item["type"] = SourceType.Video;
      related.push(item as Item);
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
    var genres: Genre[] = [];
    var genresElement = metaInfos.filter(function () {
      return (
        $(this).find(".item-title").text().trim().toLowerCase() == "genre:"
      );
    });
    if (genresElement.length > 0) {
      genresElement.find(".item-content > a").each(function () {
        var genre: Partial<Genre> = {};
        genre["id"] = $(this).attr("href").split("/")[2];
        genre["name"] = $(this).text().trim();
        genre["url"] = $(this).attr("href").startsWith("/")
          ? `${baseUrl}${$(this).attr("href")}`
          : $(this).attr("href");
        genre["isPaginated"] = true;
        genre["nextPageNumber"] = 1;
        genre["previousPageNumber"] = undefined;
        genres.push(genre as Genre);
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

    var episodes: ItemMedia[] = [];
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
          description: "",
          url: item[1].startsWith("/") ? `${baseUrl}${item[1]}` : item[1],
          language: "Unknown",
          number: Number(item[3].trim()),
          type: MediaType.ExtractorVideo,
          sources: [],
        } as ItemMedia);
      });
    }

    return {
      id: id,
      name: name,
      description: description,
      imageUrl: imageUrl,
      url: url,
      type: SourceType.Video,
      source: undefined,
      language: "Unknown",
      trailerUrl: "",
      synopsis: synopsis,
      related: related,
      genres: genres,
      media: episodes,
      releaseDate: releaseDate,
      rating: rating,
      creators: creators,
      status: status,
      otherNames: otherNames,
    } as DetailedItem;
  }

  async getItemMedia(id: string): Promise<(ExtractorAudio | ExtractorVideo | RawAudio | RawVideo)[]> {
    const baseUrl = this.baseUrl;
    const serversUrl = `${baseUrl}/ajax/episode/servers?episodeId=${
      id.split("ep=")[1]
    }`;
    const serversResponse = await fetch(serversUrl)
      .then((response) => response)
      .then((data) => data.json());
    const serversRegex =
      /<div[\s\S]*?data-type="([\s\S]*?)"[\s\S]*?data-id="([\s\S]*?)"[\s\S]*?btn">([\s\S]*?)</g;
    const servers = [...serversResponse.html.matchAll(serversRegex)].map(
      function (item) {
        return {
          language: item[1][0].trim().toUpperCase() + item[1].trim().slice(1),
          id: item[2].trim(),
          name: item[3].trim(),
        };
      }
    );
    var sources: (ExtractorVideo | ExtractorAudio | RawAudio | RawVideo)[] = [];
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
        source["type"] = MediaType.ExtractorVideo;
        source["url"] = serverResponse.link;
        source["name"] = server.name + " - " + server.language;
        sources.push(source as ExtractorVideo);
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
