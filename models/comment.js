const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  username: String,
  body: String,
});

module.exports = mongoose.model("Comment", commentSchema);
