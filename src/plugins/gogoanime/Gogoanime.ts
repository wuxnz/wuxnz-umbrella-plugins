import { type CheerioAPI, load } from "cheerio";

class Gogoanime {
  baseUrl = "https://gogoanimez.to";
  // ajaxUrl = 'https://ajax.gogocdn.net';
  sourceType = "Video";
  async search(query: string, page?: number): Promise<object> {
    try {
      var baseUrl = this.baseUrl;
      const url = `${baseUrl}/?s=${query}&paged=${page || 1}`;
      const response = await fetch(url)
        .then((response) => response)
        .then((data) => data.text());
      if (!response) {
        return {};
      }
      const items = [];
      const $: CheerioAPI = load(response);
      $(".items li").each(function () {
        var item = {};
        item["id"] = $(this)
          .find("a")
          .attr("href")
          .split("/anime/")[1]
          .substring(
            0,
            $(this).find("a").attr("href").split("/anime/")[1].length - 1
          );
        item["name"] = $(this).find(".name a").text().trim();
        item["description"] = $(this).find(".released").text().trim();
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
        url: decodeURIComponent(
          `${this.baseUrl}/search.html?keyword=${query}&page=${page}`
        ),
        isPaginated: true,
        nextPageNumber: page + 1,
        previousPageNumber: page > 1 ? page - 1 : undefined,
        items: items,
      };
    } catch (err) {
      throw err;
    }
  }
  async getCategory(category: string, page?: number): Promise<object> {
    return {};
  }
  async getHomeCategories(): Promise<object[]> {
    const baseUrl = this.baseUrl;
    const response = await fetch(`${baseUrl}`)
      .then((response) => response)
      .then((data) => data.text());

    const $: CheerioAPI = load(response);

    var categories = [];

    categories.push({
      name: "Recently Released",
      url: baseUrl,
      isPaginated: false,
      items: (($: CheerioAPI) => {
        var items = [];
        $("#anime-list li").each(function () {
          items.push({
            id: $(this)
              .find("a")
              .attr("href")
              .split(baseUrl)[1]
              .substring(
                1,
                $(this).find("a").attr("href").split(baseUrl)[1].length - 1
              )
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
      items: (($: CheerioAPI) => {
        var items = [];
        const imageUrlRegex = /url\("(.*?)"\)/;
        $("div.popular > ul:nth-child(1) > li").each(function () {
          items.push({
            id: $(this)
              .find("a")
              .attr("href")
              .split("/anime/")[1]
              .substring(
                0,
                $(this).find("a").attr("href").split("/anime/")[1].length - 1
              ),
            name: $(this).find("a").attr("title").trim(),
            description: $(this).find(".episode").text().trim(),
            imageUrl: $(this)
              .find("div.thumbnail-popular")
              .attr("style")
              .match(imageUrlRegex)?.[1],
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
  }
  async getItemDetails(id) {
    const baseUrl = this.baseUrl;
    const url = `${this.baseUrl}/anime/${id}/`;
    const response = await fetch(url)
      .then((response) => response)
      .then((data) => data.text());
    if (!response) {
      return {};
    }
    const $: CheerioAPI = load(response);
    const name = $("h1").text().trim();
    const description = $("p.type")
      .filter(function () {
        return $(this).find("span").text().includes("Type:");
      })
      .first()
      .text()
      .replace("Type:", "")
      .trim();
    var imageUrl = $(".anime_info_body_bg img").attr("src");
    if (imageUrl.startsWith("/")) {
      imageUrl = `${this.baseUrl}/${imageUrl}`;
    }
    const language = name.includes("(Dub)") ? "English" : "Sub";
    var synopsis = $("div.description").text().trim();
    const openingTagRegex = /<.*?>/g;
    synopsis = synopsis.replace(openingTagRegex, "");
    const closingTagRegex = /<\/.*?>/g;
    synopsis = synopsis.replace(closingTagRegex, "");
    const genres = [];
    $("p.type")
      .filter(function () {
        return $(this).find("span").text().includes("Genres:");
      })
      .first()
      .find("a")
      .each(function () {
        var genre = {};
        genre["id"] = $(this).attr("href").split("/")[2];
        genre["name"] = $(this).text().trim();
        genre["url"] = $(this).attr("href").startsWith("/")
          ? `${baseUrl}${$(this).attr("href")}`
          : $(this).attr("href");
        genre["isPaginated"] = false;
        genre["items"] = [];
        genres.push(genre);
      });
    const releaseDate = $("p.type")
      .filter(function () {
        return $(this).find("span").text().includes("Released:");
      })
      .first()
      .text()
      .replace("Released:", "")
      .trim();
    const status = $("p.type")
      .filter(function () {
        return $(this).find("span").text().includes("Status:");
      })
      .first()
      .text()
      .replace("Status:", "")
      .trim();
    const otherNames = $("p.other-name")
      .text()
      .replace("Other name:", "")
      .trim()
      .split(", ");
    const seriId = $("#movie_id").attr("value");
    const nonceRegex = /nonce:[\s\S]*?'([\s\S]*?)'/;
    const nonce = response.match(nonceRegex)[1];
    const formData = new FormData();
    formData.append("action", "load_episode_range");
    formData.append("range_start", "1");
    formData.append("range_end", "100000");
    formData.append("seri_id", seriId);
    formData.append("nonce", nonce);
    const episodeRangeResponse = await fetch(
      `${baseUrl}/wp-admin/admin-ajax.php`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response)
      .then((data) => data.json());
    const episodes = [];
    const episodeRegex =
      /<li><a[\s\S]*?"([\s\S]*?)"[\s\S]*?name[\s\S]*?an>([\s\S]*?)<[\s\S]*?>([\s\S]*?)<[\s\S]*?cate[\s\S]*?>([\s\S]*?)</gm;
    const episodesList = [...episodeRangeResponse.data.matchAll(episodeRegex)];
    for (const episode of episodesList) {
      episodes.push({
        id: episode[1].trim().split("/")[
          episode[1].trim().split("/").length - 2
        ],
        name: episode[2] + episode[3],
        url: episode[1],
        language: episode[4].trim().toLowerCase() === "dub" ? "English" : "Sub",
        number: parseInt(episode[3].trim()),
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
  }
  async getItemMedia(id) {
    const url = `${this.baseUrl}/${id}/`;
    const episodePageResponse = await fetch(url)
      .then((response) => response)
      .then((data) => data.text());
    if (!episodePageResponse) {
      return [];
    }
    var sources = [];
    const $: CheerioAPI = load(episodePageResponse);
    $(".anime_muti_link ul li").each(function () {
      const sourceUrlRegex = /src="(.+?)"/;
      const source = $(this)
        .find("a")
        .attr("data-video")
        .match(sourceUrlRegex)[1];
      sources.push({
        type: "ExtractorVideo",
        url: source,
        name: source.includes("gogoanime")
          ? $(this).find("a").text().includes("Dub")
            ? "Gogoanime (Dub)"
            : "Gogoanime (Sub)"
          : $(this)
              .find("a")
              .text()
              .trim()
              .replace("Choose this server", "")
              .trim() +
            `(${
              $(this).attr("class")[0] + $(this).attr("class").substring(1)
            })`,
        language: $(this).find("a").text().includes("Dub") ? "English" : "Sub",
        iconUrl: source.includes("gogoanime")
          ? "https://gogoanimez.to/wp-content/uploads/2025/08/cropped-xcropped-icon-1-32x32.webp.pagespeed.ic_.ZrytaVsz_G-32x32.webp"
          : undefined,
        headers: {
          Referer: url,
        },
      });
    });
    return sources;
  }
}

module.exports = {
  search: async (query: string, page?: number) =>
    new Gogoanime().search(query, page),
  getCategory: async (category: string, page?: number) =>
    new Gogoanime().getCategory(category, page),
  getHomeCategories: async () => new Gogoanime().getHomeCategories(),
  getItemDetails: async (id: string) => new Gogoanime().getItemDetails(id),
  getItemMedia: async (id: string) => new Gogoanime().getItemMedia(id),
};

export default Gogoanime;
