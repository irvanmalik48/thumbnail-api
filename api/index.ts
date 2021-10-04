import chromium from "chrome-aws-lambda";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const title: any = req.query.q;
  const trimmedTitle: string = title.replace(".jpg", "");
  const image = "https://avatars.githubusercontent.com/u/71539547?v=4";
  const svg = "https://raw.githubusercontent.com/irvanmalik48/blog/main/public/bg/bg.svg";

  function content(trimmedTitle: string) {
    return `<html>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
                <style>
                    html, body {
                        height: 100%;
                        padding: 0;
                        margin: 0;
                        background-color: #6cc;
                    }

                    .block-1 {
                        height: 100%;
                        width: 200px;
                        position: fixed;
                        background-color: #5bb;
                        bottom: 0;
                        right: 600px;
                    }

                    .block-2 {
                        height: 100%;
                        width: 200px;
                        position: fixed;
                        background-color: #4aa;
                        bottom: 0;
                        right: 400px;
                    }

                    .block-3 {
                        height: 100%;
                        width: 200px;
                        position: fixed;
                        background-color: #399;
                        bottom: 0;
                        right: 200px;
                    }

                    .block-4 {
                        height: 100%;
                        width: 200px;
                        position: fixed;
                        background-color: #288;
                        bottom: 0;
                        right: 0;
                    }
            
                    p {
                        padding: 0;
                        margin: 0;
                    }
            
                    .wrapper {
                        font-family: 'Roboto', sans-serif;
                        font-weight: bold;
                        width: 100%;
                        background-color: #333;
                        color: #fff;
                        font-size: 52px;
                        padding: 40px 60px 50px 60px;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        box-sizing: border-box;
                        z-index: 99;
                    }
            
                    .credit {
                        font-family: 'Roboto', sans-serif;
                        font-size: 24px;
                        font-weight: normal;
                        opacity: 70%;
                    }
                </style>
            </head>
            <body>
                <div class="block-1"></div>
                <div class="block-2"></div>
                <div class="block-3"></div>
                <div class="block-4"></div>
                <div class="wrapper">
                    <p>${trimmedTitle}</p>
                    <p class="credit">Irvan Malik Azantha &lt;irvanmalik48@gmail.com&gt;</p>
                </div>
            </body>
            </html>`;
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
    height: 600,
  });
  page.setContent(content(trimmedTitle));
  const screenshot: any = await page.screenshot();
  res.writeHead(200, {
    "Content-Type": "image/jpg",
    "Content-Length": Buffer.byteLength(screenshot),
  });
  res.end(screenshot);
};
