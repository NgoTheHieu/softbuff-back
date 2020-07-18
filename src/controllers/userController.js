const User = require("../models/user");

exports.createUser = async (req, res, next) => {
  try {
    const { email, name, password ,type} = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({
        status: "Fail",
        error: "Email, name and password are required",
      });
    }


    const user = await User.create({
      email: email,
      name: name,
      password: password,
      type: type || "normal",
    });

    res.status(201).json({ status: "ok", data: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", error: err.message });
  }
};

exports.getMyProfile = async (req, res) => {
  res.json({ status: "ok", data: req.user });
};
