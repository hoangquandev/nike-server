const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid Email address" });
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a postive number");
      }
    }
  },
  userType: {
    type: String,
    required: true,
    default: "user"
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ],
  productsFavorite: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true,
        validate: value => {
          if (value < 0) {
            throw new Error("Price must be a positive number");
          }
        }
      },
      size: {
        type: String,
        required: true
      },
      img: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
        validate: (value) => {
          if (value < 1) {
            throw new Error("Quantity must be a positive number and > 1");
          }
        },
      },
      status: {
        type: Number,
        default: 1
      },
      sizes: [{
        size: {
            type: String,
            required: true
        }
      }],
      message: {
        type: String
      },
    }
  ]
});
userSchema.virtual("product", {
  ref: "Product",
  localField: "_id",
  foreignField: "userCreated"
});

userSchema.virtual("cart", {
  ref: "Cart",
  localField: "_id",
  foreignField: "userOrder"
});

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "31 day"
  });
  //  console.log("user"+ user);
  // update token
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// run when .save
userSchema.pre("save", async function(next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, user.password.length);
  }
  next();
});
// dide
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.__v;
  return userObject;
};

//  model method
userSchema.statics.findByCredentials = async (email, password) => {
  // console.log(email);
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
