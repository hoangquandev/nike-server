import User from "./../../db/models/user";
// Show all users
export const index = async (req, res) => {
  try {
    const users = await User.find({});    
    res.send(users).status(200);
  } catch (error) {
    res.status(500).send();
  }
};

// Show user by id
export const show = async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);
    if (!user) return res.status(404).send({ messager: "No user found" });
    res.send(user).status(200);
  } catch (error) {
    res.status(500).send();
  }
};

export const getId = async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(404).send({ messager: "No user found" });
  res.send(user._id).status(200);
}

// Create new user
export const create = async (req, res) => {
  const user = new User(req.body);
  try {
    // khi gọi user.save() thì userSchema.pre sẽ được gọi
    // find user đã tồn tại chưa bỏi email
    const userExit = await User.findOne({ email: user.email });
    if (userExit) {
      return res.status(400).send({ error: "email is exit!" });
    }
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
};

// Update an user
export const update = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  // hàm every trả về true false vs hàm includes kiểm tra phần tử có nằm trong mảng ko cũng trả về true false
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates! keys" });
  }
  const user = await User.findById(req.user._id);
  if (user) {
    try {
      req.user.name = req.body.name || req.user.name;
      req.user.email = req.body.email || req.user.email;
      req.user.password = req.body.password || req.user.password;
      req.user.age = req.body.age || req.user.age;
      const updatedUser = await req.user.save();
      return res.status(200).send({ messager: "update success", updatedUser });
    } catch (e) {
      return res.status(400).send(e);
    }
  }
};

export const remove = async (req, res) => {
  const _id = req.body._id;
  const user = await User.findById(_id);
  try {
    await user.remove();
    res.status(200).send({ messager: "delete success", user });
  } catch (error) {
    res.status(500).send();
  }
};

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(item => {
      return item.token != req.token;
    });
    await req.user.save();
    res.send({ messager: "logout success" }).status(200);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const logoutAll = async (req, res) => {
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    res.send({ messager: "logout all devices" }).status(200);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // giống static method
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token, messager: "login success" }).status(200);
  } catch (error) {    
    return res.status(400).send(error.message);
  }
};
export const updateAdmin = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  // hàm every trả về true false vs hàm includes kiểm tra phần tử có nằm trong mảng ko cũng trả về true false
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates! keys" });
  }

  const user = await User.findOne({_id: req.params.id});
  console.log(user);
  if (user) {
    try {
      user.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password;
      user.age = req.body.age;
      const updatedUser = await user.save();
      return res.status(200).send({ messager: "update success", updatedUser });
    } catch (e) {
      return res.status(400).send(e);
    }
  }
};
export const addFavorite = async (req, res) => {
  try {
    const { productsFavorite } = req.body;
    if (req.user.productsFavorite.length === 0) {
      req.user.productsFavorite = productsFavorite;
      await req.user.save();
      return res
        .send({ productsFavorite, messager: "update favorite success" })
        .status(200);
    } else {
      req.user.productsFavorite = productsFavorite;
      await req.user.save();
      return res
        .send({ productsFavorite, messager: "add favorite success" })
        .status(200);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};
