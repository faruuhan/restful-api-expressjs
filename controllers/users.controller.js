var bcrypt = require("bcryptjs");
const Validator = require("fastest-validator");
const v = new Validator();
const { usersModel } = require("../models");

const createUser = async (req, res) => {
  const schema = {
    fullName: "string|empty:false",
    email: "email",
    password: "string|min:8",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    const response = {
      status: 400,
      errors: validate,
    };
    return res.status(400).json(response);
  }

  const encryptPassword = await bcrypt.hash(req.body.password, 10);

  const { fullName, email } = req.body;

  const userIsReady = await usersModel.findOne({ where: { email } });

  if (userIsReady) {
    const response = { status: 409, message: "email is already" };
    return res.status(409).json(response);
  }

  const data = await usersModel.create({
    fullName,
    email,
    password: encryptPassword,
    userStatus: "Active",
    userImg: "default.jpg",
  });

  if (data) {
    const response = { status: 200, message: "success create user" };
    return res.status(200).json(response);
  } else {
    const response = { status: 400, message: "unsuccess create user" };
    return res.status(400).json(response);
  }
};

const getAllUser = async (req, res) => {
  const data = await usersModel.findAll();
  const response = { status: 200, data: data };
  return res.status(200).json(response);
};

module.exports = { createUser, getAllUser };
