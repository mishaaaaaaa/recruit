const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
//const fs = require("fs");
import { Browser } from "puppeteer";

puppeteer.use(StealthPlugin());

// card scan

const url = "https://djinni.co/jobs";

const validVacancyUrl = "https://djinni.co";

type tPrimaryVacancy = {
  position: string | "";
  link: string | "";
};

const main = async () => {
  const browser: Browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();
  await page.goto(url);

  //const data: any = [];

  const vacanciesLinkList: tPrimaryVacancy[] = await page.evaluate((validVacancyUrl: string) => {
    const vacancyCards = Array.from(document.querySelectorAll(".job-list-item"));
    const data = vacancyCards.map((vacancy: HTMLElement) => {
      return {
        position: vacancy.querySelector("a.h3.job-list-item__link").innerHTML.trim(),
        link: validVacancyUrl + vacancy.querySelector("a.h3.job-list-item__link").getAttribute("href"),
      };
    });
    return data;
  }, validVacancyUrl);

  // data.push(...bookData);

  console.log(vacanciesLinkList);

  // собираю инфу в цикле, если последний элемент перехожу на главную страницу

  for (let i = 0; i < vacanciesLinkList.length; i++) {
    if (vacanciesLinkList[i]?.link) {
      await page.goto(vacanciesLinkList[i].link);
    }
  }

  await browser.close();
};

//main();

// авторизация = первая карточка вакансии (получаю тайтл шорт био )
