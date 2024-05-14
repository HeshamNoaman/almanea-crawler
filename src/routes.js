import { Dataset, createPuppeteerRouter } from 'crawlee';
import { BASE_URL, selectors, labels } from './constants.js';

export const router = createPuppeteerRouter();

// Add a handler to our router to handle requests with the 'START' label
router.addHandler(labels.START, async ({ crawler, request, page, log, infiniteScroll }) => {
    log.info('START handler');
    console.log(`Fetching URL: ${request.url}`);

    // start scrolling to reach the end of the page
    await infiniteScroll({
        scrollDownAndUp: true,
        timeoutSecs: 5,
    });

    // get the content of all the product
    const allProduct = await page.$$eval(
        selectors.productLists,
        (products, selectors, label, BASE_URL) => {
            return products.map((product) => {

                const url = `${BASE_URL}${product.querySelector(selectors.title).getAttribute('href')}`;
                const originalPrice = product.querySelector(selectors.originalPrice);

                return {
                    url,
                    label,
                    // Pass the scraped data about the product to the next
                    // request so that it can be used there
                    userData: {
                        data: {
                            productName: product.querySelector(selectors.title).textContent,
                            url: url,
                            photo: product.querySelector(selectors.img).getAttribute('src'),
                            price: product.querySelector(selectors.priceAfterDiscount).textContent,
                            wasPrice: originalPrice ? originalPrice.textContent : null,
                        },
                    },
                };

            });
        },
        selectors, labels.PRODUCT, BASE_URL
    );

    log.info(`number of items are: ${allProduct.length}`);

    await crawler.addRequests(allProduct);
});


router.addHandler(labels.PRODUCT, async ({ request, page, log, pushData }) => {

    const { data } = request.userData;

    const descriptionLists = await page.$$eval(
        selectors.descriptionLists,
        (lists, selectors) => {
            return lists.map(list => {
                const key = list.querySelector(selectors.descriptionKey).textContent;
                const value = list.querySelector(selectors.descriptionValue).textContent;
                return `${key}: ${value}`;
            });
        },
        selectors
    );

    await pushData({
        // await Dataset.pushData({
        ...data,
        description: descriptionLists,
    });

    // log.info(`description add ${descriptionLists}`);
});
