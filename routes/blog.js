const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Post = require("../models/post");
const { postSchema } = require("../schemas.js");

const validatePost = (req, res, next) => {
  const { error } = postSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const posts = await Post.find({});
    res.render("blog/index", { posts });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("blog/new");
});

router.post(
  "/",
  isLoggedIn,
  validatePost,
  catchAsync(async (req, res, next) => {
    const post = new Post(req.body.post);
    post.author = req.user._id;
    //console.log("USER ID =>", req.user._id);
    await post.save();
    req.flash("success", "Successfully made a new post!"); // make new flash on successful post request
    res.redirect(`/blog/${post._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id)
      .populate("comments")
      .populate("author");
    if (!post) {
      req.flash("error", "Cannot find that post.");
      return res.redirect("/blog ");
    }
    res.render("blog/show", { post, currentUser: req.user });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render("blog/edit", { post });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  validatePost,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, {
      ...req.body.post,
    });
    req.flash("success", "Successfully updated post!");
    res.redirect(`/blog/${post._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted post");

    res.redirect("/blog");
  })
);

module.exports = router;
