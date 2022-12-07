import User from "./../../db/models/user";
import Cart from "./../../db/models/cart";
//Show all Cart by Admin

export const index = async (req, res) => {
  try {
    const cart = await Cart.find({});
    res.send(cart).status(200);
  } catch (error) {
    res.status(500).send({messager: "Something went wrong ..."});
  }
};

//Show Cart
export const show = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id });
    await user.populate("cart").execPopulate();
    res.send(user.cart).status(200);
  } catch (error) {
    res.status(500).send({messager: "Something went wrong ..."});
  }
};

//Create Cart
export const create = async (req, res) => {
  try {
    const newCart = new Cart({
      userOrder: req.user._id,
      products: req.body.products,
      isPayed: req.body.isPayed,
      description: req.body.description
    });
    await newCart.save();
    res.status(200).send({messager: "Create Successful", newCart});
  } catch (error) {
    res.status(500).send(error);
  }
};

//Remove cart by id cart
export const remove = async (req, res) => {
  const _id = req.body._id;
  const cart = await Cart.findById(_id);
  try {
    await cart.remove();
    res.status(200).send({ messager: "Delete success" });
  } catch (error) {
    res.status(400).send({ messager: "Delete fail" });
  }
};

//Update status 1 2 3 ...
export const update = async (req, res) => {
  const updates = Object.keys(req.body);
  console.log(updates);
  const allowedUpdates = "status";
  if (updates[0] !== allowedUpdates) {
    return res.status(400).send({ error: "Invalid updates! keys" });
  }

  const cart = await Cart.findById(req.params.id);
  if (cart) {
    try {
      cart.status = req.body.status || cart.status;
      const updatedCart = await cart.save();
      return res.status(200).send({ messager: "update success", updatedCart });
    } catch (e) {
      return res.status(400).send(e);
    }
  }
};
