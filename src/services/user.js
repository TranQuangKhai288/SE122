const User = require("../models/user");

const bcrypt = require("bcryptjs");
const { genneralAccessToken, genneralRefreshToken } = require("./jwt");

//createUser tested
const createUser = async (newUser) => {
  const { name, email, password, confirmPassword } = newUser;
  try {
    const checkUser = await User.findOne({
      email: email,
    });
    if (checkUser) {
      return {
        status: "ERR",
        message: "The email is already",
      };
    }

    const hash = bcrypt.hashSync(password, 10);
    const createdUser = await User.create({
      name,
      email,
      password: hash,
    });
    if (createdUser) {
      return {
        status: "OK",
        message: "SUCCESS",
        data: createdUser,
      };
    }
  } catch (e) {
    return {
      status: "ERR",
    };
  }
};

//loginUser tested completed
const loginUser = async (userLogin) => {
  const { email, password } = userLogin;
  try {
    const check = await User.findOne({
      email: email,
    });

    if (check === null) {
      return {
        status: "ERR",
        message: "User is not exist",
      };
    }

    const comparePassword = bcrypt.compareSync(password, check.password);
    if (!comparePassword) {
      return {
        status: "ERR",
        message: "The password or user is incorrect",
      };
    }

    const access_token = await genneralAccessToken({
      id: check.id,
      isAdmin: check.isAdmin,
    });

    const refresh_token = await genneralRefreshToken({
      id: check.id,
      isAdmin: check.isAdmin,
    });

    return {
      status: "OK",
      message: "LOGIN SUCCESS",
      data: check,
      access_token,
      refresh_token,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message || "An error occurred",
    };
  }
};

const getDetailsUser = async (id) => {
  try {
    const user = await User.findById(id)
      .select("-password")
      .select("-__v")
      .select("-isAdmin")
      .exec();

    if (user === null) {
      return {
        status: "ERR",
        message: "The user is not defined",
      };
    }
    return {
      status: "OK",
      message: "SUCESS",
      data: user,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message || "An error occurred",
    };
  }
};

module.exports = {
  createUser,
  loginUser,
  getDetailsUser,
};
