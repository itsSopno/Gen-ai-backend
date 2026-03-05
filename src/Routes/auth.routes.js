const express = require('express');
const authRouter = express.Router();
const { registerUserController, loginUserController } = require("../Controllers/auth.controller")
/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public 
 * 
 */
authRouter.post("/register", registerUserController)

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post("/login", loginUserController)

module.exports = authRouter;