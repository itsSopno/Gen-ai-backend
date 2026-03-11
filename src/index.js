const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const app = require("../app");
const connectDB = require("./Config/database")

app.listen(3000, async () => {
    await connectDB();
    console.log("server is running on port 3000")
})