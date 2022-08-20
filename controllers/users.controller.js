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
    const response = { status: 200, message: "success to create user" };
    return res.status(200).json(response);
  } else {
    const response = { status: 400, message: "failed to create user" };
    return res.status(400).json(response);
  }
};

const getAllUser = async (req, res) => {
  const data = await usersModel.findAll();
  const datafilter = await data.map(({ id, fullName, email, userImg }) => {
    return { id, fullName, email, userImg };
  });
  const response = { status: 200, data: datafilter };
  return res.status(200).json(response);
};

const deleteUser = async (req, res) => {
  const userIsReady = await usersModel.findOne({ where: { id: req.params.id } });

  if (!userIsReady) {
    const response = { status: 400, message: "user data not found!" };
    return res.status(400).json(response);
  }

  await usersModel.destroy({ where: { id: req.params.id } });

  const response = { status: 201, data: "data deleted" };
  return res.status(201).json(response);
};

const updateUser = async (req, res) => {
  const userIsReady = await usersModel.findOne({ where: { id: req.params.id } });

  if (!userIsReady) {
    const response = { status: 400, message: "user data not found!" };
    return res.status(400).json(response);
  }

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

  const { fullName, email, password, userStatus, userImg } = req.body;

  const emailAlreadyExist = await usersModel.findOne({ where: { email } });

  if (emailAlreadyExist && emailAlreadyExist.id != req.params.id) {
    const response = { status: 409, message: "email already exist!" };
    return res.status(409).json(response);
  }

  const encryptPassword = await bcrypt.hash(password, 10);

  const data = await usersModel.update(
    {
      fullName,
      email,
      password: encryptPassword,
      userStatus,
      userImg,
    },
    {
      where: { id: req.params.id },
    }
  );

  if (data) {
    const response = { status: 200, message: "success to update data user" };
    return res.status(200).json(response);
  } else {
    const response = { status: 400, message: "failed to update user" };
    return res.status(400).json(response);
  }
};

module.exports = { createUser, getAllUser, deleteUser, updateUser };
