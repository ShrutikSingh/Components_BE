
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const routes = require ("./routes/route")
app.use("/api/v1",routes);


app.listen(PORT,() => {
    console.log(`App listening on port ${PORT}`)
});

app.get("/", (req,res) => {
    res.send("This is HomePage")
})