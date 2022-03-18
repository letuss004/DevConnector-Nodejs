const mongoose = require("mongoose");
const config = require("config");
// const db = config.get("mongoURI");
const db = "mongodb+srv://mongouser:12345678@devconnector.hbwfp.mongodb.net/DevConnector?retryWrites=true&w=majority"

const connectDB = async (uri, callback) => {
    try {
        await mongoose.connect(
            db,
            function (err, db) {
                console.log("Db connection call back.")
            }
        );
        console.log("MongoDB connected");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
module.exports = connectDB;
