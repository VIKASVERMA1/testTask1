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
      "mongodb+srv://ecommerce:ecom123@cluster0.uomwd.mongodb.net/local?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function () {
      console.log("Connected successfully");
    });
    //local_oplog.rs
    const data = await db
      .collection("clustermanager")
      .find({}, { projection: { createdAt: 0, updatedAt: 0, __v: 0 } })
      .toArray();
      // console.log(data);
    // let res = await axios.delete(`http://176.9.137.77:9200/newpurchaseorders/_doc/70bc8f4b72a86921468bf8e8441dce51`, {})
    for (let item in data) {
      let res = await axios.post(`http://176.9.137.77:9200/local_clustermanager/_doc/${data[item]._id}`, {
        data: data[item],
      });
      console.log(res);
    }
  } catch (error) {
    console.log(error.response);
  }
})();

