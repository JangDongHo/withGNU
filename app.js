const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const getRestaurantUrl = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1366,
    height: 768,
  });

  const keyword = "가좌동 통큰돼지";
  await page.goto(
    `https://m.map.naver.com/search2/search.naver?query=${keyword}&sm=hty&style=v5`
  );
  const content = await page.content();
  const $ = cheerio.load(content);
  const restaurantCid = $(
    "#ct > div.search_listview._content._ctList > ul > li > div.item_info > a.a_item.a_item_distance._linkSiteview"
  ).attr("data-cid");
  if (restaurantCid) {
    const url = `https://m.place.naver.com/restaurant/${restaurantCid}`;
  }
  browser.close();
};

getRestaurantUrl();
