import chromium from "chrome-aws-lambda";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const title: any = req.query.q;
    const trimmedTitle: string = title.replace(".jpg", "");

    function content(trimmedTitle: string) {
        return (
            ""
        );
    }
    
    const browser = await chromium.puppeteer.launch({
        args: [
            ...chromium.args,
            "--hide-scrollbars",
            "--disable-web-security"
        ],
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
    page.setContent(
        content(trimmedTitle)
    );
    const screenshot: any = await page.screenshot();
    res.writeHead(200, {
        "Content-Type": "image/jpg",
        "Content-Length": Buffer.byteLength(screenshot),
    });
    res.end(screenshot);
}