const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async (uri, callback) => {
    try {
        await mongoose.connect(
            db,
            () => {
            },
            (err) => {
                console.log("DB callback")
                console.log(err);
            }
        );
        console.log("MongoDB connected");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};


module.exports = connectDB;
