const mongoose = require("mongoose");
const { default: validator } = require("validator");

const cartSchema = new mongoose.Schema(
  {
    userOrder: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        quantity: {
          type: Number,
          required: true,
          validate: (value) => {
            if (value < 1) {
              throw new Error("Quantity must be a positive number and > 1");
            }
          },

        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          validate: (value) => {
            if (value < 0) {
              throw new Error("Price must be a positive number");
            }
          },
        },
        size: {
          type: String,
          required: true,
        },
        img: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          required: true,
        }
      },
    ],
    status: {
      type: Number,
      default: 1,
      validate(value) {
        if (value < 0) {
          throw new Error("Status must be a positive number");
        }
      },
    },
    isPayed: {
      type: Boolean,
      default: false
    },
    description: {
      type: String
    },
    modifiedOn: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

cartSchema.methods.toJSON = function () {
  const cart = this;
  const cartObject = cart.toObject();

  delete cartObject.modifiedOn;
  delete cartObject.__v;
  return cartObject;
};

module.exports = mongoose.model("Cart", cartSchema);
