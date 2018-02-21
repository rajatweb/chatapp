const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

app.use(bodyParser.json());
app.use(express.static(publicPath));

app.listen(port, () => {
    console.log(`Server is up and running on ${port}`);
});