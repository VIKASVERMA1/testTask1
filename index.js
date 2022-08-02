const express = require("express");
const app = express();
const axios = require("axios");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Client } = require("@elastic/elasticsearch");

(async () => {
  try {
    const md5 = require("md5");
    const client = new Client({
      node: "http://176.9.137.77:9200", headers: {
        contenttype: 'application/json; charset=UTF-8'
      }
    });
    await mongoose.connect(
      "mongodb+srv://ecommerce:ecom123@cluster0.uomwd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function () {
      console.log("Connected successfully");
    });
    // const data = await db
    //   .collection("products")
    //   .find({}, { projection: { createdAt: 0, updatedAt: 0, __v: 0 } })
    //   .toArray();
      //educationdatabase_pdffiles-------educationdatabase_video
      //ex-educationdatabase_staffs
      // console.log(data);
    let res = await axios.delete(`http://176.9.137.77:9200/products`, {})
    // for (let item in data) {
    //   let res = await axios.post(`http://176.9.137.77:9200/products/_doc/${data[item]._id}`, {
    //     data: JSON.parse(JSON.stringify(data[item])),
    //   });
      console.log(res);
    // }http://176.9.137.77/
  } catch (error) {
    console.log(error.response);
  }
})();

