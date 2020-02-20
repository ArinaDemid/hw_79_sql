const express = require("express");
const cors = require("cors");
const categories = require("./app/categories");
const places = require("./app/places");
const items = require("./app/items");
const mysqlDB = require('./mysqlDB');

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.use("/categories", categories);
app.use("/places", places);
app.use("/items", items);

const run = async () => {
  await mysqlDB.connect();

  app.listen(port, () => {
    console.log(`HTTP Server started on${port} port!`);
  });

  process.on('exit', () => {
    mysqlDB.disconnect();
  });
};

run().catch(e => {
  console.log(e);
});
