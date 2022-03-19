const mongoose = require("mongoose");
const config = require("config");
// const db = config.get("mongoURI");
const db = "mongodb+srv://mongoroot:84aIJcZU2B6Dqj51@devconnector.hbwfp.mongodb.net/DevConnector?retryWrites=true&w=majority"

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
