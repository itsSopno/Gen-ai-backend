const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../Models/Blacklist.model")
async function authUser(req, res, next) {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })

    }
    const tokeblacklismodel = await tokenBlacklistModel.findOne({ token })
    if (tokeblacklismodel) {
        return res.status(401).json({ message: "token is blacklisted" })
    }
    try {
        const decode = jwt.verify(token.process.env.JWT_SECRET,)
        req.user = decode
        next()
    } catch (error) {
        return res.status(401).json({ message: "Unauthorixed" })
    }
}

module.exports = authUser