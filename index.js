const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const PORT = process.env.PORT || 3000;
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const coursesRoutes = require("./routes/courses.js");
const blogRoutes = require("./routes/blog.js");
const usersRoutes = require("./routes/users.js");
const commentRoutes = require("./routes/comments.js");

// connect to db

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Mongo connection open!");
  })
  .catch((err) => {
    console.log("Mongo connection error:");
    console.log(err);
  });

// END OF PRODUCTION

// app settings
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // better security
    // cookies expire after a week
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success"); // make flash accessible everywhere (success, error)
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/course", coursesRoutes);
app.use("/blog", blogRoutes);
app.use("/blog/:id/comments", commentRoutes);
app.use("/", usersRoutes);
app.get("/our-team", (req, res) => {
  res.render("team");
});

// catch errors
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  if (!err.message) err.message = "Oh no, Something went wrong!";
  res.status(statusCode).render("error", { err });
  res.send("Something went wrong!");
});
// Listen on port
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
