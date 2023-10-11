const axios = require("axios");
const cheerio = require("cheerio");
const j2cv = require("json2csv").Parser;
const fs = require("fs");

const url = "https://www.ynet.co.il/news/category/184";
const news_data = [];

(async function getNewsData() {
  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    const news = $(".Accordion .AccordionSection .titleRow");

    news.each(function () {
      newFlash = $(this).find(".title").text().trim();
      datetime = $(this).find("time").attr("datetime");
      hour = new Date(datetime).getHours();
      minute = new Date(datetime).getMinutes();
      time = hour + ":" + minute;
      news_data.push({ time, newFlash });
    });

    const parser = new j2cv();
    const csv = parser.parse(news_data);
    fs.writeFileSync("./news.csv", csv);

    console.log(news_data);
  } catch (error) {
    console.error(error);
  }
})();
