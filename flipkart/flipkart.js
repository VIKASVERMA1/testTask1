const axios = require("axios");
const cheerio = require("cheerio");
const { index } = require("cheerio/lib/api/traversing");

const url = "https://www.flipkart.com/search?q=mobiles";

axios.get(url).then((response) => {
  const flipData = response.data;
  const $ = cheerio.load(flipData);
  const list = [];


  $(".col-7-12", flipData).each((index, element) => {
    const ProductName = $(element).children('._4rR01T').text()
    const productDetail=$(element).children('.fMghEO').text()
    $("._2kHMtA", flipData).each((index, element) => {
        const productUrl=$(element).children('._1fQZEK').attr('href')
        list.push({
            ProductName,
            productDetail,
            productUrl
          });
    })
  });
  console.log(list)
}).catch(err=>console.log(err))

