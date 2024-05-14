import { PuppeteerCrawler, log } from 'crawlee';
import { router } from './routes.js';
import { startUrl, labels } from "./constants.js";
import { optimizePageLoad } from "../utils/puppeteerUtils.js";


const allowedTypes = ['document', 'script', "xhr"];

const crawler = new PuppeteerCrawler({
    headless: false,
    preNavigationHooks: [({ page }) => optimizePageLoad(page, allowedTypes)],
    requestHandler: router,

    // maxRequestsPerCrawl: 20,
    // navigationTimeoutSecs: 60,
    // maxConcurrency: 2,

    // launchContext: {
    // launchOptions: { headless: false, },
    // userDataDir: './tmp',
    // }
});

// Add our initial requests
await crawler.addRequests([
    { url: startUrl, label: labels.START }
]);

log.info('Starting the crawl.');

await crawler.run();

log.info('Crawl finished.');