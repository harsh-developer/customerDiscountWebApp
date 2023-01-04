const { findOne, findOneAndUpdate } = require("mongoose");
const customerModel = require("../models/customerModel");
const orderModel = require("../models/orderModel");
const ObjectId = require("mongoose").Types.ObjectId;

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
    if (!price) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter product price!" });
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
