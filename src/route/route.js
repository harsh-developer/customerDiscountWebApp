const express = require("express");
const router = express.Router();
const {
  registerCustomer,
  getCustomers,
} = require("../controller/customerController");
const { orderDetails } = require("../controller/orderController");

router.get("/testAPI", function (req, res) {
  res.send("I am test API");
});

router.post("/register", registerCustomer);

router.get("/customer", getCustomers);

router.post("/placeorder/:id", orderDetails);

module.exports = router;
