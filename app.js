// puppeteer을 가져온다.
const puppeteer = require("puppeteer");
// cheerio를 가져온다.
const cheerio = require("cheerio");

(async () => {
  // 브라우저를 실행한다.
  // 옵션으로 headless모드를 끌 수 있다.
  const browser = await puppeteer.launch({
    headless: false,
  });

  // 새로운 페이지를 연다.
  const page = await browser.newPage();
  // 페이지의 크기를 설정한다.
  await page.setViewport({
    width: 1366,
    height: 768,
  });

  const keyword = "가좌동%20돼지국밥";
  await page.goto(`https://map.kakao.com`);
  await page.waitForSelector('input[id="search.keyword.query"]');
  const content = await page.content();
  const $ = cheerio.load(content);
  const input = await page.$('input[id="search"]');
  await input.click();
  await input.type(keyword);
  await page.keyboard.press("Enter");
  browser.close();
})();
