const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require("cookie-parser")
app.use(express.json());
app.use(cookieParser())
app.use(cors());
const authRouter = require("./src/Routes/auth.routes")
/**using all the routes */
app.use("/api/auth", authRouter)

// Test route
app.get("/", (req, res) => {
    res.json({ message: "Server is running" })
})

module.exports = app;