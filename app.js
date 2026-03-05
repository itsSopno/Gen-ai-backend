const express = require('express');
const app = express();

app.use(express.json());

const authRouter = require("./src/Routes/auth.routes")
/**using all the routes */
app.use("/api/auth", authRouter)

module.exports = app;