const express = require("express");
const mysqlDB = require("../mysqlDB");
const router = express.Router();

router.get("/", async (req, res) => {
  const places = await mysqlDB
    .getConnection()
    .query("SELECT `id`, `name` FROM `places`");
  res.send(places);
});

router.get("/:id", async (req, res) => {
  const place = await mysqlDB
    .getConnection()
    .query("SELECT * FROM `places` WHERE `id` = ?", req.params.id);

  const placeElement = place[0];

  if (!placeElement) {
    return res.status(404).send({ error: "ID not found" });
  }

  res.send(placeElement);
});

router.delete("/:id", async (req, res) => {
  try {
    await mysqlDB
    .getConnection()
    .query("DELETE FROM `places` WHERE `id` = ?", req.params.id);
  res.send("Place was deleted!");
  } catch(e) {
    res.send({error: e.sqlMessage});
  }
  
});

router.post("/", async (req, res) => {
  const place = req.body;

  if (!place.name) {
    res
      .status(400)
      .send({ error: "Name of place must be present in the request" });
  }

  const postPlace = await mysqlDB
    .getConnection()
    .query("INSERT INTO `places` (`name`, `description`) VALUES" + "(?, ?)", [
      place.name,
      place.description
    ]);
  res.send({
    id: postPlace.insertId,
    name: place.name,
    description: place.description
  });
});

router.put("/:id", async (req, res) => {
  const place = req.body;

  if (!place.name) {
    res
      .status(400)
      .send({ error: "Name of place must be present in the request" });
  } else {
    await mysqlDB
      .getConnection()
      .query(
        "UPDATE `places` SET `name` = ?, `description` = ? WHERE `id` = ?",
        [place.name, place.description, req.params.id]
      );
    res.send({
      id: req.params.id,
      name: place.name,
      description: place.description
    });
  }
});

module.exports = router;
