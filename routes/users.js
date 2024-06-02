const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { storeReturnTo, isLoggedIn } = require("../middleware");

const validateUser = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get("/register", isLoggedIn, (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  isLoggedIn,
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(e);
        req.flash("success", "Welcome to Fight Club Gym!");
        res.redirect("/blog");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", `Welcome back ${req.user.username}!`);
    const redirectUrl = res.locals.returnTo || "/"; // Return to original URL otherwise go to homepage
    delete req.session.returnTo;
    return res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/");
  });
});

router.get("/admin", isLoggedIn, (req, res) => {
  res.render("admin");
});

module.exports = router;
