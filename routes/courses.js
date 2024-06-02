const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
/*
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { storeReturnTo } = require("../middleware");
*/

router.get("/kickbox", (req, res) => {
  res.render("./courses/kickbox");
});
router.get("/grappling", (req, res) => {
  res.render("./courses/grappling");
});
router.get("/mma", (req, res) => {
  res.render("./courses/mma");
});

module.exports = router;
