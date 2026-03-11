const express = require('express');
const authRouter = express.Router();
const middleware = require("../middlewares/auth.middleware")
const { registerUserController, loginUserController, logoutUserController, getMeController } = require("../Controllers/auth.controller")
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

/**
 * @route Get / api / auth / logout
 * @desc Logout a user
 * @access Public
 */
authRouter.get("/logout", logoutUserController)

/**
 * @route GET / api / auth /get-me
 * @description get user profile
 * @access Public
 */
authRouter.get("/get-me", middleware.authUser, getMeController)
module.exports = authRouter;