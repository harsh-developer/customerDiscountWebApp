const express = require("express");
const router = express.Router();

router.get("/testAPI", function (req, res) {
  res.send("I am test API");
});

module.exports = router;
