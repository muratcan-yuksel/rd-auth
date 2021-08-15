var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
//add these
var passport = require("passport");
var Strategy = require("passport-twitter").Strategy;
var session = require("express-session");
const fs = require("fs");

passport.use(
  new Strategy(
    {
      consumerKey: "KEY",
      consumerSecret: "SECRET",
      callbackURL: "RETURN URL",
    },
    function (token, tokenSecret, profile, callback) {
      console.log(profile);
      return callback(null, profile);
    }
  )
);

passport.serializeUser(function (user, callback) {
  callback(null, user);
});
passport.deserializeUser(function (obj, callback) {
  callback(null, obj);
});
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//add this too
app.use(
  session({
    secret: "whatever",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", function (req, res) {
  res.render("index", { user: req.user });
});
//destination of the index we defined earlier
app.get("/twitter/login", passport.authenticate("twitter"));
//if the authentication is not a successs
app.get(
  "/twitter/login",
  passport.authenticate("twitter", {
    failureRedirect: "/",
  }),
  function (req, res) {
    res.redirect("/");
  }
);

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
