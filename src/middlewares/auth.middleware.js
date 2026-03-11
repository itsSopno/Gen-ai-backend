const jwt = require("jsonwebtoken")
const tokeblacklismodel = re
function authUser(req, res, next) {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })

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