require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");

// const verifyJWT = require("./middleware/verifyjwt");

const credentials = require("./middleware/credentials");

const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");
const connectDb = require("./config/dbConn");

const PORT = process.env.PORT || 3500;

//connect to mongoDB
connectDb();

//cross origin resources
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
// in other words, form data:
// ‘content-type: application/x-www-form-urlencoded’
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// routes
app.use("/register", require("./routes/register"));
app.use("/signin", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));

mongoose.connection.once("open", () => {
  console.log("connected to DB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
