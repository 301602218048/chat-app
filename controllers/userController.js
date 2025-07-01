const Users = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();

const addUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    const e = await Users.findOne({ where: { email: email } });
    if (e) {
      return res
        .status(400)
        .json({ msg: "Email already exists, Please Login", success: false });
    }
    const saltRounds = 10;
    const hashpass = await bcrypt.hash(password, saltRounds);
    await Users.create({
      name: name,
      email: email,
      password: hashpass,
      phoneNumber: phoneNumber,
    });
    res.status(201).json({ msg: "Signed up successfully", success: true });
  } catch (error) {
    res.status(500).json({ msg: error.message, success: false });
  }
};

module.exports = {
  addUser,
};
