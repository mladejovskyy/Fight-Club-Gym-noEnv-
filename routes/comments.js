const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Comment = require("../models/comment");
const Post = require("../models/post");
const { commentSchema } = require("../schemas.js");
const { isLoggedIn } = require("../middleware.js");

const validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateComment,
  catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    post.comments.push(comment);
    await comment.save();
    await post.save();
    req.flash("success", "Successfully made a new comment!");
    res.redirect(`/blog/${post._id}`);
  })
);

router.delete(
  "/:commentId",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id, commentId } = req.params; // post ID and comment ID
    const post = await Post.findById(id);
    if (!post) {
      req.flash("error", "Cannot find that post!");
      return res.redirect("/blog");
    }

    // Remove the comment from the post
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);

    req.flash("success", "Successfully deleted comment");
    res.redirect(`/blog/${id}`);
  })
);

module.exports = router;
