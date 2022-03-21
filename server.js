const express = require("express");
const connectDB = require("./config/db");

// define
// todo: what express ?
const app = express();
const PORT = process.env.PORT || 5000;

// Connect db
connectDB()
    .then(
        () => console.log("After db connect.")
    )
    .catch(
        () => console.log("DB fail")
    );

// Init Middleware
app.use(
    express.json(
        {extended: false}
    )
);

// Listen connections
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// get request
app.get("/", (req, res) => res.send("Nodejs is running..."));

// Define routes
// TODO: ????
app.use('/api/users', require('./routes/api/user'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profiles', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))



