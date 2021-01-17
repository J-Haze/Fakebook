require("dotenv").config();
var createError = require("http-errors");
const express = require("express");
// const wakeUpDyno = require("./wakeUpDyno.js");
const path = require("path");
const cookieParser = require("cookie-parser");
var logger = require("morgan");
var flash = require("connect-flash");
const bcrypt = require("bcryptjs");
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

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../client", "build", "index.html")); // relative path
//   });
// }

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

// // Serve static assets if in production
// if (process.env.NODE_ENV === "production") {
//   // Set static folder
//   // All the javascript and css files will be read and served from this folder
//   // app.use(express.static("/build"));
//   // app.use(express.static("../client/build"));
//   //  app.use(express.static("./client/build"));

//   app.use(express.static("client/build"));

//   // index.html for all page routes    html or routing and naviagtion
//   app.get("*", (req, res) => {
//     // res.sendFile(path.resolve(__dirname, "./build", "build", "index.html"));

//     res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
//     // res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

//Routers
var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
var postRouter = require("./routes/post");

//Routes Middleware
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);

// // Serve static assets if in production
// if (process.env.NODE_ENV === "production") {
//   // Set static folder
//   // All the javascript and css files will be read and served from this folder
//   // app.use(express.static("/build"));
//   // app.use(express.static("../client/build"));
//   //  app.use(express.static("./client/build"));

//   app.use(express.static("client/build"));

//   // index.html for all page routes    html or routing and naviagtion
//   app.get("*", (req, res) => {
//     // res.sendFile(path.resolve(__dirname, "./build", "build", "index.html"));

//     // res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
//     res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
//   });
// }

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   // res.render("error");
// });

// // Serve static assets if in production
// if (process.env.NODE_ENV === "production") {
//   // Set static folder
//   // All the javascript and css files will be read and served from this folder
//   // app.use(express.static("/build"));
//   // app.use(express.static("../client/build"));
//   //  app.use(express.static("./client/build"));

//   app.use(express.static("client/build"));

//   // index.html for all page routes    html or routing and naviagtion
//   app.get("*", (req, res) => {
//     // res.sendFile(path.resolve(__dirname, "./build", "build", "index.html"));

//     // res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

// // Serve static assets if in production
// if (process.env.NODE_ENV === "production") {
//   // Set static folder
//   // All the javascript and css files will be read and served from this folder
//   // app.use(express.static("/build"));
//   // app.use(express.static("../client/build"));
//   //  app.use(express.static("./client/build"));

//   app.use(express.static("../client/build"));

//   // index.html for all page routes    html or routing and naviagtion
//   app.get("*", (req, res) => {
//     // res.sendFile(path.resolve(__dirname, "./build", "build", "index.html"));

//     res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
//     // res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../client", "build", "index.html")); // relative path
//   });
// }

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html")); // relative path
  });
}

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
