const BASE_URL = 'https://www.almanea.sa';

// https://www.almanea.sa/mobiles-tablets-c-7423/mobiles-c-7424
const startUrl = `${BASE_URL}/mobiles-tablets-c-7423/mobiles-c-7424`;

const selectors = {
    productLists: 'div.grid.grid-cols-12.gap-4 > div .text-zinc-700',
    title: '.product-text-content > a',
    img: 'div > div.relative > div.relative > img',
    originalPrice: '.product-text-content .text-zinc-400 > span',
    priceAfterDiscount: '.product-text-content .text-red > span',
    descriptionLists: 'div > ul > li > div.hidden div.grid',
    descriptionKey: 'div.rounded-sm',
    descriptionValue: 'div:nth-child(2).rounded-sm',

};

const labels = {
    START: 'START',
    PRODUCT: 'PRODUCT',
    OFFERS: 'OFFERS',
};

export { BASE_URL, startUrl, selectors, labels }