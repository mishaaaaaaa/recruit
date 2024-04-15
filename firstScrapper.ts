const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");
import { Browser } from "puppeteer";

puppeteer.use(StealthPlugin());

// const email = "misha_rudenko_01";
// const pass = "Papa09101972";

// https://djinni.co/login?from=frontpage_main

// const url = "https://djinni.co/login?from=frontpage_main";

//   await page.type("#email", email);

//   await page.type("#password", pass);

//   await page.click("[type=submit]");

//   await page.goto("https://djinni.co/jobs");

const url = "https://books.toscrape.com/";

const main = async () => {
  const browser: Browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();
  await page.goto(url);

  const data: any = [];

  const totalPages = await page.evaluate(() => {
    const getTotalPages = () => {
      const paginationString = document.querySelector(".current")?.innerHTML;
      if (!paginationString) {
        return 0;
      }
      const indexOfOf = paginationString.indexOf("of");
      if (indexOfOf === -1) {
        return 0;
      }
      const totalPagesString = paginationString.slice(indexOfOf + 3);
      const totalPages = parseInt(totalPagesString.trim(), 10);
      return totalPages || 0;
    };

    const totalPages = getTotalPages();
    return totalPages;
  });

  console.log("Total pages:", totalPages);

  for (let i = 0; i < totalPages - 1; i++) {
    // Ваш код для сбора данных с текущей страницы
    console.log(`Processing page ${i + 1}`);

    const bookData = await page.evaluate((url) => {
      const bookPods = Array.from(document.querySelectorAll(".product_pod"));
      const data = bookPods.map((book) => ({
        title: book.querySelector("h3 a")?.getAttribute("title"),
        price: book.querySelector(".price_color")?.innerHTML,
        imageSrc: url + book.querySelector("img")?.getAttribute("src"),
        rating: book.querySelector(".star-rating")?.classList[1],
      }));
      return data;
    }, url);

    data.push(...bookData);

    await page.waitForSelector(".next a");
    await page.click(".next a");
  }

  const generateRandomFileName = (fileName: string) => {
    const randomNumber = Math.floor(Math.random() * 10000);

    const fileParts = fileName.split(".");
    const name = fileParts[0];
    const extension = fileParts[1];

    const newFileName = `${name}_${randomNumber}.${extension}`;

    return newFileName;
  };

  // Пример использования функции
  const fileName = "bookData.json";
  const randomFileName = generateRandomFileName(fileName);

  fs.writeFile(randomFileName, JSON.stringify(data), (err: any) => {
    if (err) throw err;
    console.log("Saved successfully");
  });
  await browser.close();
};

main();

// авторизация = первая карточка вакансии (получаю тайтл шорт био )

//----------------

// const main = async () => {
//   const browser: Browser = await puppeteer.launch({ headless: false });

//   const page = await browser.newPage();
//   await page.goto(url);

//   const scrape = await page.evaluate((page) => {
//     // 1) получить общее количество страниц
//     // 2) написать цыкл

//     //  let data: any = [];

//     //  const nextBtn = document.querySelector('.next a')

//     const getTotalPages = () => {
//       const paginationString = document.querySelector(".current")?.innerHTML;
//       // Если строка пагинации не найдена или пуста, возвращаем 0
//       if (!paginationString) {
//         return 0;
//       }
//       // Ищем индекс символа "of", который указывает на общее количество страниц
//       const indexOfOf = paginationString.indexOf("of");
//       // Если "of" не найдено, возвращаем 0
//       if (indexOfOf === -1) {
//         return 0;
//       }
//       // Получаем подстроку, начиная с индекса "of" до конца строки
//       const totalPagesString = paginationString.slice(indexOfOf + 3);
//       // Преобразуем строку в число, удаляя лишние пробелы и символы новой строки
//       const totalPages = parseInt(totalPagesString.trim(), 10);

//       return totalPages || 0;
//     };

//     const totalPages = getTotalPages();

//     if (totalPages > 0) {
//       for (let i = 0; i <= totalPages; i++) {
//         console.log(page);
//         // page.click(".next a");
//         //  nextBtn.click()
//       }
//     }

//     // if (totalPages > 0) {
//     //   for (let i = 0; i <= totalPages; i++) {
//     //     if(i == totalPages){ }else {
//     //       const bookPods = Array.from(document.querySelectorAll(".product_pod"));
//     //       const data = bookPods.map((book) => ({
//     //         title: book.querySelector("h3 a")?.getAttribute("title"),
//     //         price: book.querySelector(".price_color")?.innerHTML,
//     //         imageSrc: url + book.querySelector("img")?.getAttribute("src"),
//     //         rating: book.querySelector(".star-rating")?.classList[1],
//     //       }));
//     //     }
//     //     const bookPods = Array.from(document.querySelectorAll(".product_pod"));
//     //     const data = bookPods.map((book) => ({
//     //       title: book.querySelector("h3 a")?.getAttribute("title"),
//     //       price: book.querySelector(".price_color")?.innerHTML,
//     //       imageSrc: url + book.querySelector("img")?.getAttribute("src"),
//     //       rating: book.querySelector(".star-rating")?.classList[1],
//     //     }));
//     //     return data;
//     //   }
//     //  }

//     // return data;
//   }, page);

//   console.log(scrape);

//   // const bookData = await page.evaluate((url) => {
//   //   const bookPods = Array.from(document.querySelectorAll(".product_pod"));
//   //   const data = bookPods.map((book) => ({
//   //     title: book.querySelector("h3 a")?.getAttribute("title"),
//   //     price: book.querySelector(".price_color")?.innerHTML,
//   //     imageSrc: url + book.querySelector("img")?.getAttribute("src"),
//   //     rating: book.querySelector(".star-rating")?.classList[1],
//   //   }));
//   //   return data;
//   // }, url);

//   // console.log(bookData);

//   //   console.log("123");

//   // fs.writeFile("bookData.json", JSON.stringify(bookData), (err: any) => {
//   //   if (err) throw err;
//   //   console.log("Saved successfully");
//   // });
//   await browser.close();
// };

// main();

// ------------------------

// const app = express();

// app.get("/", (req, res) => {
//   res.send("Привет, мир!");
// });

// app.get("/scrape", async (req, res) => {
//   try {
//     const response = await fetch("https://djinni.co/jobs/my/");
//     const html = await response.text();

//     console.log(html);
//     const dom = new JSDOM(html);

//     const document = dom.window.document;

//     const downloads = document.querySelector("#job-item-312667")?.textContent;

//     console.log("жопа", downloads);
//     res.status(200).send(downloads); // Отправить ответ клиенту сразу после получения данных
//   } catch (error) {
//     console.error("Ошибка при получении данных:", error);
//     res.status(500).send("Произошла ошибка при получении данных");
//   }
// });

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Сервер запущен на порту ${PORT}`);
// });
