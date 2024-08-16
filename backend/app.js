const express = require("express");
const cors = require("cors");

const app = express();

// require route

const route = require("./app/routes/route");
const productRoute = require("./app/routes/productRoute");



app.use(cors());
app.use(express.json())

app.use("/api/test",route)
app.use("/api/product",productRoute)

module.exports = app;


