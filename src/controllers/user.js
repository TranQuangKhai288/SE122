const fs = require("fs");
const path = require("path");
const UserService = require("../services/user");
const JwtService = require("../services/jwt");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const { spawn } = require("child_process");
// const { MongoClient, ServerApiVersion } = require("mongodb");
// const { RemoteRunnable } = require("@langchain/core/runnables/remote");
// const {
//   StringOutputParser,
// } = require('@langchain/core/output_parsers');
// const { MODEL_DEFAULT } = require('~/common/contants');
// const parser = new StringOutputParser();
// const ragChainUrl = process.env.RAG_SERVICE_

// Validate request

const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!name || !email || !password || !confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is email",
      });
    } else if (password !== confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "The password is equal confirmPassword",
      });
    }
    const response = await UserService.createUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.error("Error creating user:", e);
    console.error("Stack trace:", e.stack);

    return res.status(404).json({
      status: "ERR",
      message: e,
      details: e.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is email",
      });
    }
    const response = await UserService.loginUser(req.body);
    const { refresh_token, ...newReponse } = response;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
    return res.status(200).json({
      ...newReponse,
      refresh_token,
    });
  } catch (e) {
    console.error("Error logging:", e);
    console.error("Stack trace:", e.stack);

    return res.status(404).json({
      message: e,
      details: e.message,
    });
  }
};

const getDetailsUser = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await UserService.getDetailsUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    console.error("Error get user detail", e);
    console.error("Stack trace:", e.stack);
    return res.status(404).json({
      message: e,
      details: e.message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    let token = req.cookies.refresh_token;
    let bodyrefreshToken = req.body.refresh_token;
    console.log("bodyrefreshToken", bodyrefreshToken);
    if (!token && !bodyrefreshToken) {
      return res.status(200).json({
        status: "ERR",
        message: "The token is required",
      });
    }
    let response;
    if (token) {
      response = await JwtService.refreshTokenJwtService(token);
    } else {
      response = await JwtService.refreshTokenJwtService(bodyrefreshToken);
    }
    return res.status(200).json(response);
  } catch (e) {
    console.error("Error get refreshToken", e);
    console.error("Stack trace:", e.stack);
    return res.status(404).json({
      message: "Failed to create refreshToken",
      details: e.message,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  getDetailsUser,
  refreshToken,
};
