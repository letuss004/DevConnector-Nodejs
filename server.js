const express = require("express");

// define
// todo: what express ?
const app = express();
const PORT = process.env.PORT || 5000;

// Listen connections
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// get request
app.get("/", (req, res) => res.send("API running"));

// Define routes
app.use('/api/users', require('./routes/api/user'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profiles', require('./routes/api/profile'))
app.use('/api/users', require('./routes/api/user'))

