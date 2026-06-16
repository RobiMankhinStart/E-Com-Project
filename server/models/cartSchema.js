const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cart", cartSchema);
