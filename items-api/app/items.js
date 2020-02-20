const express = require("express");
const mysqlDB = require("../mysqlDB");
const multer = require("multer");
const path = require("path");
const config = require("../config");
const nanoid = require("nanoid");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, config.uploadPath);
  },
  filename: function(req, file, cb) {
    cb(null, nanoid() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
  const items = await mysqlDB
    .getConnection()
    .query("SELECT `id`, `name`, `id_category`, `id_place` FROM `items`");
  res.send(items);
});

router.get("/:id", async (req, res) => {
  const item = await mysqlDB
    .getConnection()
    .query("SELECT * FROM `items` WHERE `id` = ?", req.params.id);

  const itemElement = item[0];

  if (!itemElement) {
    return res.status(404).send({ error: "ID not found" });
  }

  res.send(itemElement);
});

router.delete("/:id", async (req, res) => {
  await mysqlDB
    .getConnection()
    .query("DELETE FROM `items` WHERE `id` = ?", req.params.id);
  res.send("Item was deleted!");
});

router.post("/", upload.single("image"), async (req, res) => {
  const item = req.body;

  if (req.file) {
    req.body.image = req.file.filename;
  }

  if (!item.name) {
    res
      .status(400)
      .send({ error: "Name of item must be present in the request" });
  } else if (!item.id_category) {
    res
      .status(400)
      .send({ error: "Category of item must be present in the request" });
  } else if (!item.id_place) {
    res
      .status(400)
      .send({ error: "Place of item must be present in the request" });
  } else {
    const postItem = await mysqlDB
      .getConnection()
      .query(
        "INSERT INTO `items` (`id_category`, `id_place`, `name`, `description`, `image`) VALUES" +
          "(?, ?, ?, ?, ?)",
        [
          item.id_category,
          item.id_place,
          item.name,
          item.description,
          item.image
        ]
      );
    res.send({
      id: postItem.insertId,
      name: item.name,
      id_category: item.id_category,
      id_place: item.id_place
    });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  const newItem = req.body;

  if (req.file) {
    req.body.image = req.file.filename;
  }

  if (!newItem.name) {
    res
      .status(400)
      .send({ error: "Name of item must be present in the request" });
  } else if (!newItem.id_category) {
    res.status(400).send({
      error: "Category of item must be present in the request"
    });
  } else if (!newItem.id_place) {
    res.status(400).send({
      error: "Place of item must be present in the request"
    });
  } else {
    await mysqlDB
      .getConnection()
      .query(
        "UPDATE `items` SET `name` = ?, `description` = ?, `image` = ?, `id_category` = ?, `id_place` = ? WHERE `id` = ?",
        [
          newItem.name,
          newItem.description,
          newItem.image,
          newItem.id_category,
          newItem.id_place,
          req.params.id
        ]
      );
    res.send({
      id: req.params.id,
      name: newItem.name,
      description: newItem.description,
      image: newItem.image,
      id_category: newItem.id_category,
      id_place: newItem.id_place
    });
  }
});

module.exports = router;
