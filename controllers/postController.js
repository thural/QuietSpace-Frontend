const Filter = require('bad-words')
const customFilter = new Filter({ placeHolder: '*' })
const dirty_words = require("../dirty_words")
const Post = require("../models/postModel")
const User = require("../models/userModel")
customFilter.addWords(...dirty_words)

const checkInput = (value, { req }) => {
	if (customFilter.isProfane(value)) return false;
	const does_match = dirty_words.some(word => {
		const regex = new RegExp(`\\s${word}\\s|mother.+|sister.+`, 'i')
		return regex.test(value)
	})
	if (does_match) return false
	else return true
}

const { body, validationResult } = require("express-validator")
const { validatePost, savePost } = require("../middleware/postMiddleware")

exports.list = (req, res, next) => {
	Post.find()
		.sort([["date", "descending"]])
		.exec((err, posts) => {
			if (err) return next(err)
			if (req.user) {
				const postIndex = posts.findIndex(elem => elem.username === req.user.username)
				if (postIndex !== -1) {
					const userPost = posts[postIndex]
					posts.splice(postIndex, 1)
					posts.unshift(userPost)
				}
			}
			res.json({ posts })
		})
}

exports.item = async (req, res, next) => {
	try {
		const post = await Post.findOne({ id: req.param.id })
		res.json({ post })
	} catch (err) { return next(err) }
}

exports.create_post = [
	body("text", "at least 2 characters required").isLength({ min: 2 }),
	body("text", "max 64 characters allowed").isLength({ max: 64 }),
	body("text").custom(checkInput).withMessage("Your post can not contain bad words"),
	validatePost,
	savePost
]

exports.edit_post = [
	body("text", "at least 2 characters required").isLength({ min: 2 }),
	body("text", "max 64 characters allowed").isLength({ max: 64 }),
	body("text").custom(checkInput).withMessage("Your post can not contain bad words"),
	async (req, res, next) => {
		const errors = validationResult(req)
		try {
			const post = await Post.findOne({ "_id": req.params.id })
			post.text = req.body.text
			if (!errors.isEmpty()) return res.json({ errors: errors.array() })
			post.save((err) => {
				if (err) return next(err)
        console.log("saved post: ", post)
        return res.status(200).json(post)
			})
		} catch (err) { return next(err) }
	}
]

exports.delete_post = (req, res, next) => {
	if (req.params.id === "") return res.status(204).send()
	Post.deleteOne({ _id: req.params.id })
		.exec((err, post) => {
			if (err) return next(err)
			console.log("deleted post: ", post)
			res.status(204).send()
		})
}

exports.like_post = async (req, res, next) => {
	if (req.params.id === "") return res.status(204).send()
	try {
		await Post.updateOne({ _id: req.params.id }, { "$push": { likes: req.user._id } })
		await User.updateOne({ _id: req.user._id }, { "$push": { likes: req.params.id } })
		res.status(204).send()
	} catch (err) { return next(err) }
}

exports.unlike_post = async (req, res, next) => {
	if (req.params.id === "") return res.status(204).send()
	try {
		await Post.updateOne({ _id: req.params.id }, { "$pull": { likes: req.user._id } })
		await User.updateOne({ _id: req.user._id }, { "$pull": { likes: req.params.id } })
		res.status(204).send()
	} catch (err) { return next(err) }
}