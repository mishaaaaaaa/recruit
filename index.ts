const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

import { Browser } from "puppeteer";

puppeteer.use(StealthPlugin());

const url = "https://djinni.co/jobs";

const validVacancyUrl = "https://djinni.co";

// const proxyURL = "http://64.225.8.82:9995";

type tVacancyLinkItem = {
  position: string;
  link: string;
  publicationDate: string;
};

// type tVacancyData = {
//   title: string;
//   salary: string;
//   tags?: string | Element;
//   keyWords: string;
// };

const testTime = "12:04 27.04.2024";

const main = async () => {
  const browser: Browser = await await puppeteer.launch({
    headless: false,
    // args: [`--proxy-server=${proxyURL}`],
  });

  const vacanciesLinkList: any = [];
  let vacancyIsNotExipered = true;
  let navBtnCounter = 9;

  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const page = await browser.newPage();
  await page.goto(url);

  await sleep((Math.floor(Math.random() * 12) + 5) * 1000);

  while (vacancyIsNotExipered || navBtnCounter < 11) {
    await page.waitForSelector("body > div.wrapper > div.page-content");
    const result = await page.evaluate(
      (validVacancyUrl: string, vacanciesLinkList, testTime, page) => {
        const validateDate = (vacancyDate: string, boundaryTime: string) => {
          // Преобразование даты и времени в объект Date
          const vacancyDateTime = new Date(
            vacancyDate.replace(/(\d{2}):(\d{2}) (\d{2}).(\d{2}).(\d{4})/, "$4/$3/$5 $1:$2")
          );
          const boundaryDateTime = new Date(
            boundaryTime.replace(/(\d{2}):(\d{2}) (\d{2}).(\d{2}).(\d{4})/, "$4/$3/$5 $1:$2")
          );

          // Сравнение дат
          return vacancyDateTime >= boundaryDateTime;
        };

        const vacancyCards = Array.from(document.querySelectorAll(".job-list-item"));

        const data: tVacancyLinkItem[] = vacancyCards.map((vacancy: HTMLElement) => {
          return {
            position: vacancy.querySelector("a.h3.job-list-item__link").innerHTML.trim() || "",
            link:
              validVacancyUrl + vacancy.querySelector("a.h3.job-list-item__link").getAttribute("href") || "",
            publicationDate:
              vacancy.querySelector("span.mr-2.nobr").getAttribute("data-original-title") ||
              vacancy.querySelector("span.mr-2.nobr").getAttribute("title") ||
              "",
          };
        });

        // check if all vacancies are valid by time

        const outdatedVacancieIndex = data.findIndex(
          (el, i) => !validateDate(el.publicationDate, testTime) && i
        );

        if (outdatedVacancieIndex !== -1) {
          data.splice(0, outdatedVacancieIndex);
        }

        const validData = data.splice(0, outdatedVacancieIndex);

        return {
          data,
          vacancyCards,
          validData,
          isNotExpired: outdatedVacancieIndex == -1 ? true : false,
        };
      },
      validVacancyUrl,
      vacanciesLinkList,
      testTime,
      page
    );

    vacanciesLinkList.push(result.data);
    vacancyIsNotExipered = result.isNotExpired;

    console.log(result);
    //  console.log(result.vacancyCards);

    //  if (result.isNotExpired) {
    await page.waitForSelector(
      `body > div.wrapper > div.page-content > div > div > div.col-lg-8.row-mobile-order-2 > main > ul.pagination.pagination_with_numbers > li:nth-child(${navBtnCounter}) > a`
    );

    await page.click(
      `body > div.wrapper > div.page-content > div > div > div.col-lg-8.row-mobile-order-2 > main > ul.pagination.pagination_with_numbers > li:nth-child(${navBtnCounter}) > a`
    );
    if (navBtnCounter < 15) navBtnCounter++;

    // vacancyIsNotExipered = result.isNotExpired;
  }

  // data.push(...bookData);

  //console.log(vacanciesLinkList);

  //  console.log(vacanciesLinkList);

  // let dataVacancies: tVacancyData[] = [];

  // for (let i = 0; i < vacanciesLinkList.length; i++) {
  //   if (vacanciesLinkList[i]?.link) {
  //     await page.goto(vacanciesLinkList[i].link);

  //     const vacancyData: tVacancyData = await page.evaluate(() => {
  //       const gydrateTextContent = (textContent: string) => {
  //         return textContent.trim().replace(/\s+/g, " ").replace(/\n/g, "");
  //       };
  //       const titleElement = document.querySelector(
  //         "body > div.wrapper > div.page-content > div > header > div.detail--title-wrapper > div > div > h1"
  //       );

  //       const salaryElement = document.querySelector(
  //         "body > div.wrapper > div.page-content > div > header > div.detail--title-wrapper > div > div > h1 > span"
  //       );

  //       const tagsElement = document.querySelector("ul:nth-child(3) > li > div > div.col.pl-2");
  //       const keyWordsElement = document.querySelector(
  //         "ul:nth-child(3) > li:nth-child(2) > div > div.col.pl-2"
  //       );

  //       return {
  //         title: titleElement ? gydrateTextContent(titleElement.textContent) : "",
  //         salary: salaryElement ? gydrateTextContent(salaryElement.textContent) : "",
  //         tags: tagsElement ? gydrateTextContent(tagsElement.textContent) : "",
  //         keyWords: keyWordsElement ? gydrateTextContent(keyWordsElement.textContent) : "",
  //       };
  //     });

  //     if (vacancyData) {
  //       dataVacancies.push(vacancyData);
  //     }
  //   }
  // }

  // console.log(dataVacancies);

  await browser.close();
};

main();

// // авторизация = первая карточка вакансии (получаю тайтл шорт био )
