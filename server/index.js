require("dotenv").config();
var createError = require("http-errors");
const express = require("express");
// const wakeUpDyno = require("./wakeUpDyno.js");
const path = require("path");
const cookieParser = require("cookie-parser");
var logger = require("morgan");
var flash = require("connect-flash");
const bcrypt = require("bcryptjs");
var multer = require("multer");
require("./config/passport");

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const config = require("./config/key");

const mongoose = require("mongoose");
const connect = mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html")); // relative path
  });
}

app.use(flash());
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(logger("dev"));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Routers
var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
var postRouter = require("./routes/post");
var requestRouter = require("./routes/request");
var notificationRouter = require("./routes/notification");

//Routes Middleware
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/request", requestRouter);
app.use("/notification", notificationRouter);

app.use("/uploads", express.static("uploads"));

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../client", "build", "index.html")); // relative path
//   });
// }

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});

//Wake up dyno:
// const PORT = 8080;
// const DYNO_URL = "https://justins-forum.herokuapp.com/"; // the url of your dyno

// app.listen(PORT, () => {
//   wakeUpDyno(DYNO_URL); // will start once server starts
// });

// module.exports = app;
