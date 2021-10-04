import chromium from "chrome-aws-lambda";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const titleP: any = req.query.title; // Always needed
  const nameP: any =
    req.query.name == undefined ? "No author specified" : req.query.name;
  const emailP: any =
    req.query.email == undefined ? " (no email specified) " : req.query.email;
  const dateP: any = req.query.date == undefined ? "No date specified" : req.query.date;
  const colorP: any = req.query.color == undefined ? "#66CCCC" : "#" + req.query.color;
  const rawTags: any = req.query.tags;
  const tagsP: any =
    rawTags != undefined
      ? rawTags
          .map((tag: any) => {
            return `#${tag}`;
          })
          .join(" ") || ""
      : "No tags given";

  function content(
    title: string,
    name: string,
    email: string,
    date: string,
    color: string,
    tags: string
  ) {
    return `<html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
        rel="stylesheet"
      />
      <style>
        html,
        body {
          height: 100%;
          padding: 0;
          margin: 0;
          background-color: ${color};
        }
  
        .block-1 {
          height: 100%;
          width: 200px;
          position: fixed;
          background-color: ${color};
          filter: brightness(90%);
          bottom: 0;
          right: 600px;
        }
  
        .block-2 {
          height: 100%;
          width: 200px;
          position: fixed;
          background-color: ${color};
          filter: brightness(80%);
          bottom: 0;
          right: 400px;
        }
  
        .block-3 {
          height: 100%;
          width: 200px;
          position: fixed;
          background-color: ${color};
          filter: brightness(70%);
          bottom: 0;
          right: 200px;
        }
  
        .block-4 {
          height: 100%;
          width: 200px;
          position: fixed;
          background-color: ${color};
          filter: brightness(60%);
          bottom: 0;
          right: 0;
        }
  
        p {
          padding: 0;
          margin: 0;
        }
  
        .wrapper {
          font-family: "Roboto", sans-serif;
          font-weight: bold;
          width: 100%;
          background-color: #333;
          color: #fff;
          font-size: 56px;
          padding: 40px 60px 50px 60px;
          position: fixed;
          bottom: 0;
          left: 0;
          box-sizing: border-box;
          z-index: 99;
        }
  
        .credit {
          font-family: "Roboto", sans-serif;
          font-size: 32px;
          font-weight: normal;
          opacity: 70%;
        }
  
        .date {
          font-family: "Roboto", sans-serif;
          font-size: 32px;
          font-weight: bold;
          color: ${color};
          padding: 20px 0 0 0;
          opacity: 100%;
        }
  
        .tags {
          font-family: "Roboto", sans-serif;
          font-size: 32px;
          font-weight: normal;
          color: ${color};
          opacity: 100%;
          text-align: end;
        }
  
        .flex {
          display: flex;
          flex-direction: row;
          margin: 14px 0 0 0;
          padding: 0;
          justify-content: space-between;
          align-items: center;
        }
      </style>
    </head>
    <body>
      <div class="block-1"></div>
      <div class="block-2"></div>
      <div class="block-3"></div>
      <div class="block-4"></div>
      <div class="wrapper">
        <p>${title}</p>
        <p class="credit">${name} &lt;${email}&gt;</p>
        <div class="flex">
          <span class="date">${date}</span>
          <span class="tags">${tags}</span>
        </div>
      </div>
    </body>
  </html>
  `;
  }

  const browser = await chromium.puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  page.setViewport({
    width: 1280,
    height: 700,
  });
  page.setContent(content(titleP, nameP, emailP, dateP, colorP, tagsP));
  const screenshot: any = await page.screenshot();
  res.writeHead(200, {
    "Content-Type": "image/jpg",
    "Content-Length": Buffer.byteLength(screenshot),
  });
  res.end(screenshot);
};
