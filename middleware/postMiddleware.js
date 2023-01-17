const Post = require("../models/postModel")
const { validationResult } = require("express-validator")

module.exports.validatePost = (req, res, next) => {
  const errors = validationResult(req)
  console.log('USER value inside validatePost() : ', req.user)
  req.post = new Post({ username: req.user.username, text: req.body.text })
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() })
  } next()
}

module.exports.savePost = async (req, res, next) => {
  try {
    const found_post = await Post.findOne({ username: req.user.username, text: req.body.text })
    if (found_post) res.json({ msg: 'post already exists' })
    else {
      req.post.save(err => {
        if (err) return next(err)
        console.log("saved post: ", req.post)
        return res.status(200).json(req.post) // TODO: avoid page reaload
      })
    }
  } catch (err) { return next(err) }
}