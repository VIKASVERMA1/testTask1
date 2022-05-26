const axios = require("axios");
const cheerio = require("cheerio");
const { index } = require("cheerio/lib/api/traversing");

const url = "https://www.snapdeal.com/search?keyword=t-shirt";

axios.get(url).then((response) => {
  const snapData = response.data;
  const $ = cheerio.load(snapData);
  const list = [];


  $(".product-tuple-description ", snapData).each((index, element) => {
    const ProductDetail = $(element).children('.product-desc-rating').text()
    list.push({
      ProductDetail,
    });
  });
  console.log(list)
}).catch(err=>console.log(err))
