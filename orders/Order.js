const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  CustomerID: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  BookID: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  initialDate: {
    type: Date,
    required: true
  },
  deliveryDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Order", OrderSchema);
