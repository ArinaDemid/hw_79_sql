const express = require("express");
const mysqlDB = require("../mysqlDB");
const router = express.Router();

router.get("/", async (req, res) => {
  const categories = await mysqlDB
    .getConnection()
    .query("SELECT `id`, `name` FROM `categories`");
  res.send(categories);
});

router.get("/:id", async (req, res) => {
  const category = await mysqlDB
    .getConnection()
    .query("SELECT * FROM `categories` WHERE `id` = ?", req.params.id);

  const categoryElement = category[0];

  if (!categoryElement) {
    return res.status(404).send({ error: "ID not found" });
  }

  res.send(categoryElement);
});

router.delete("/:id", async (req, res) => {
  try {
    await mysqlDB
    .getConnection()
    .query("DELETE FROM `categories` WHERE `id` = ?", req.params.id);
  res.send("Category was deleted!");
  } catch(e) {
    res.send({error: e.sqlMessage});
  }
  
});

router.post("/", async (req, res) => {
  const category = req.body;

  if (!category.name) {
    res
      .status(400)
      .send({ error: "Name of category must be present in the request" });
  }

  const postCategory = await mysqlDB
    .getConnection()
    .query(
      "INSERT INTO `categories` (`name`, `description`) VALUES" + "(?, ?)",
      [category.name, category.description]
    );
  res.send({
    id: postCategory.insertId,
    name: category.name,
    description: category.description
  });
});

router.put("/:id", async (req, res) => {
  const category = req.body;

  if (!category.name) {
    res
      .status(400)
      .send({ error: "Name of category must be present in the request" });
  } else {
    await mysqlDB
      .getConnection()
      .query(
        "UPDATE `categories` SET `name` = ?, `description` = ? WHERE `id` = ?",
        [category.name, category.description, req.params.id]
      );
    res.send({
      id: req.params.id,
      name: category.name,
      description: category.description
    });
  }
});

module.exports = router;
