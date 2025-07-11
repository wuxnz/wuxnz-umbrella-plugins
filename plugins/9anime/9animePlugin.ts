// import { Cheerio, CheerioAPI } from "cheerio";

// const cheerio = require("cheerio");

class ExamplePlugin {
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
      // throw new Error(`${item["id"]}`);
      item["name"] = $(this).find(".title").text().trim();
      item["description"] = $(
        `#qtip-${index}-content > div:nth-child(1) > div:nth-child(7)`
      )
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
  }

  async getCategory(category: string, page?: number): Promise<object> {
    return {};
  }

  async getHomeCategories(): Promise<object[]> {
    return [];
  }

  async getItemDetails(id: string): Promise<object> {
    return {};
  }

  async getItemMedia(id: string): Promise<object[]> {
    return [];
  }
}

module.exports = {
  search: async (query: string, page?: number): Promise<object> =>
    new ExamplePlugin().search(query, page),
  getCategory: async (category: string, page?: number): Promise<object> =>
    new ExamplePlugin().getCategory(category, page),
  getHomeCategories: async (): Promise<object[]> =>
    new ExamplePlugin().getHomeCategories(),
  getItemDetails: async (id: string): Promise<object> =>
    new ExamplePlugin().getItemDetails(id),
  getItemMedia: async (id: string): Promise<object[]> =>
    new ExamplePlugin().getItemMedia(id),
};

export default ExamplePlugin;
