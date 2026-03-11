const userModel = require("../Models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../Models/Blacklist.model")

/** 
 * @name registerUserController
 * @desc register a new user , expectss username , email and password in the request body
 * @access public
 * 
 */
async function registerUserController(req, res) {
    try {
        console.log("Request body:", req.body);
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide name, email and password" })
        }
        console.log("Checking if user exists...");
        const isUserExist = await userModel.findOne({
            $or: [
                { email: email },
                { name: name }
            ]
        })
        console.log("User exists:", isUserExist);
        if (isUserExist) {
            return res.status(400).json({ message: "User already exist wwith this emailn or name " })
        }
        console.log("Creating user...");
        const hash = await bcrypt.hash(password, 10)
        const user = await userModel.create({
            name,
            email,
            password: hash
        })
        console.log("User created:", user);
        const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1d" })
        res.cookie("token", token,)

        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        })
    } catch (error) {
        console.error("Error in registerUserController:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token
        if (token) {
            await tokenBlacklistModel.create({
                token
            })
            res.clearCookie("token")
            return res.status(200).json({ message: "User logged out successfully" })
        }
        return res.status(400).json({ message: "No token found" })
    } catch (error) {
        console.error("Error in logoutUserController:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}
/**
 * @name getMeController
 * @desc get user profile
 * @access public
 */
async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id)
    res.status(200).json({
        message: "User found",
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    })

}

/**
 * @name loginUserController 
 * @desc login a user , expects email and password in the request body
 * @access public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        return res.status(400).json({ message: "Invalid email or password" })
    }
    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1d" })
    res.cookie("token", token,)

    return res.status(201).json({
        message: "User logged in  successfully",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        }
    })
}

module.exports = { registerUserController, loginUserController, logoutUserController, getMeController };