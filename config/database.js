const mongoose = require("mongoose")
require("dotenv").config()

const dbConnect = () => {
    return mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    .then(console.log("DB connection successful"))
    .catch((err) => {
        console.log("DB connection faced some issues")
        console.error(err);
        process.exit(1);
    });
}

module.exports = dbConnect;