const Joi = require("joi");

module.exports.postSchema = Joi.object({
  post: Joi.object({
    title: Joi.string().required(),
    image: Joi.string().required(),
    body: Joi.string().required(),
  }).required(),
});

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    username: Joi.string().required(),
    body: Joi.string().required(),
  }).required(),
});
