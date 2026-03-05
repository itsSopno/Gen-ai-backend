const userModel = require("../Models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

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
        if(!name || !email || !password){
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
        if(isUserExist){
            return res.status(400).json({ message: "User already exist wwith this emailn or name " })
        }
        console.log("Creating user...");
        const hash = await bcrypt.hash(password,10)
        const user = await userModel.create({
            name,
            email,
            password : hash
        })
        console.log("User created:", user);
        const token = jwt.sign({id : user._id, name : user.name}, process.env.JWT_SECRET, {expiresIn : "1d"})
        res.cookie("token", token,)

        return res.status(201).json({
            message : "User registered successfully",
            token,
            user : {
                id : user._id,
                name : user.name,
                email : user.email,
            }
        })
    } catch (error) {
        console.error("Error in registerUserController:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

/**
 * @name loginUserController 
 * @desc login a user , expects email and password in the request body
 * @access public
 */
async function loginUserController(req, res) {
    const {email , password} = req.body;
    const user = await userModel.findOne({email})
    if(!user){
        return res.status(400).json({message : "Invalid email or password"})
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if(!isPasswordMatch){
        return res.status(400).json({message : "Invalid email or password"})
    }
    const token = jwt.sign({id : user._id, name : user.name}, process.env.JWT_SECRET, {expiresIn : "1d"})
res.cookie("token", token,)

return res.status(201).json({
    message : "User logged in  successfully",
    token,
    user : {
        id : user._id,
        name : user.name,
        email : user.email,
    }
})
}

module.exports = { registerUserController, loginUserController };