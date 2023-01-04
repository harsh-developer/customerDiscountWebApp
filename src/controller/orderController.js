const { findOne, findOneAndUpdate } = require("mongoose");
const customerModel = require("../models/customerModel");
const orderModel = require("../models/orderModel");
const ObjectId = require("mongoose").Types.ObjectId;

const isValidString = function (x) {
  if (typeof x === "undefined" || x === null) return false;
  if (typeof x != "string") return false;
  if (typeof x === "string" && x.trim().length === 0) return false;
  return true;
};

const orderDetails = async (req, res) => {
  try {
    let productDetails = req.body;
    let customerId = req.params.id;
    let { product, price } = productDetails;
    productDetails.customerId = customerId;
    if (!customerId) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter customer id!" });
    }

    if (!ObjectId.isValid(customerId)) {
      return res
        .status(400)
        .send({ status: false, msg: "Invalid customer id!" });
    }

    if (!product) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter product name!" });
    }

    if (!isValidString(product)) {
      return res
        .status(400)
        .send({ status: false, msg: "Procut name is not valid!" });
    }

    if (!price) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter product price!" });
    }

    if (!isValidString(price)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter price correctly!" });
    }

    let incrementOrderCount = await customerModel.findOneAndUpdate(
      { _id: customerId },
      { $inc: { totalOrder: +1 } }
    );

    let orderCountCheck = await customerModel.findById(customerId);

    let { totalOrder, ...rest } = orderCountCheck;

    if (totalOrder > 10) {
      let upgradeCategory = await customerModel.findOneAndUpdate(
        { _id: customerId },
        { $set: { category: "gold" } }
      );
    }

    if (totalOrder > 20) {
      {
        upgradeCategory = await customerModel.findOneAndUpdate(
          { _id: customerId },
          { $set: { category: "diamond" } }
        );
      }
    }

    let checkCategory = await customerModel.findById(customerId);
    let { category, ...restFields } = checkCategory;
    if (category == "gold") {
      productDetails.discount = "10%";
    }

    if (category == "diamond") {
      productDetails.discount = "20%";
    }

    let makeOrder = await orderModel.create(productDetails);
    return res.status(201).send({
      status: true,
      data: makeOrder,
      msg: "If you got discount this can be used on your next order!",
    });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = { orderDetails };
