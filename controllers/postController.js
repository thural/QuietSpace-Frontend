const Filter = require('bad-words')
const customFilter = new Filter({ placeHolder: '*' })
const dirty_words = require("../dirty_words")
const Post = require("../models/postModel")
const User = require("../models/userModel")
customFilter.addWords(...dirty_words)

const checkInput = (value, { req }) => {
	if (customFilter.isProfane(value)) return false
	return true
}

const { body, validationResult } = require("express-validator")
const { validatePost, savePost } = require("../middleware/postMiddleware")
const { findIndex } = require('../dirty_words')

exports.list = (req, res, next) => {
	Post.find()
		.sort([["date", "descending"]])
		.exec((err, posts) => {
			if (err) return next(err)
			if (req.user) {
				const postIndex = posts
				.findIndex(elem => elem.username === req.user.username)
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
	body("text", "at least 3 characters required").isLength({ min: 3 }),
	body("text", "max 128 characters allowed").isLength({ max: 128 }),
	// body("text").custom(checkInput).withMessage("Your post can not contain bad words"),
	validatePost,
	savePost
]

exports.edit_post = [
	body("text", "at least 3 characters required").isLength({ min: 3 }),
	body("text", "max 128 characters allowed").isLength({ max: 128 }),
	// body("text").custom(checkInput).withMessage("Your post can not contain bad words"),
	async (req, res, next) => {
		const errors = validationResult(req)
		try {
			const post = await Post.findOne({ "_id": req.params.id })
			post.text = req.body.text
			if (!errors.isEmpty()) return res.json({ errors: errors.array() })
			post.save((err) => {
				if (err) return next(err)
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
			return res.status(200).json(post)
		})
}

exports.like_post = async (req, res, next) => {
	if (req.params.id === "") return res.status(204).send()
	try {
		await Post.updateOne({ _id: req.params.id }, { "$push": { likes: req.user._id } })
		await User.updateOne({ _id: req.user._id }, { "$push": { likes: req.params.id } })
		return res.status(200).json({ post_id: req.params.id })
	} catch (err) { return next(err) }
}

exports.unlike_post = async (req, res, next) => {
	if (req.params.id === "") return res.status(204).send()
	try {
		await Post.updateOne({ _id: req.params.id }, { "$pull": { likes: req.user._id } })
		await User.updateOne({ _id: req.user._id }, { "$pull": { likes: req.params.id } })
		return res.status(200).json({ post_id: req.params.id })
	} catch (err) { return next(err) }
}

exports.add_comment = [
	body("text", "at least 3 characters required").isLength({ min: 3 }),
	body("text", "max 128 characters allowed").isLength({ max: 128 }),
	//body("text").custom(checkInput).withMessage("Your comment can not contain bad words"),
	(req, res, next) => {
		const errors = validationResult(req)
		req.comment = { username: req.user.username, text: req.body.text }
		if (!errors.isEmpty()) {
			return res.json({ errors: errors.array() })
		} next()
	},

	async (req, res, next) => {
		try {
			const post = await Post.findOne({ "_id": req.params.id })
			post.comments.push(req.comment)
			post.save(err => {
				if (err) return next(err)
				return res.status(200).json(post)
			})
		} catch (err) { return next(err) }
	}
]

exports.delete_comment = async (req, res, next) => {
	const { commentID, postID } = req.params

	try {
		const post = await Post.findOne({ "_id": postID })
		const indexOfComment = post.comments.findIndex(comment => comment['_id'].toString() == commentID)
		const removedComment = post.comments.splice(indexOfComment, 1)
		if (indexOfComment !== -1) post.save(err => {
			if (err) return next(err)
			return res.status(200).json({ commentID })
		})
	} catch (err) { return next(err) }
}

exports.like_comment = async (req, res, next) => {
	const { commentID, postID } = req.params
	const userID = req.user._id

	try {
		const post = await Post.findOne({ _id: postID })
		const user = await User.findOne({ _id: userID })
		post.comments.map(comment => {
			if (comment['_id'].toString() == commentID) {
				comment.likes.push(userID)
			}
			return comment
		})

		user.commentlikes.push(commentID)

		post.save(err => {
			if (err) return next(err)
			user.save(err => {
				if (err) return next(err)
				return res.status(200).json({ commentID })
			})
		})
	} catch (err) { return next(err) }
}

exports.unlike_comment = async (req, res, next) => {
	const { commentID, postID } = req.params
	const userID = req.user._id

	try {
		const post = await Post.findOne({ _id: postID })
		const user = await User.findOne({ _id: userID })

		post.comments.map(comment => {
			if (comment['_id'].toString() == commentID) {
				const likeIndex = comment.likes.indexOf(userID)
				if (likeIndex !== -1) comment.likes.splice(likeIndex, 1)
			}
			return comment
		})

		const likeIndexInUser = user.commentlikes.indexOf(commentID)
		user.commentlikes.splice(likeIndexInUser, 1)

		post.save(err => {
			if (err) return next(err)
			user.save(err => {
				if (err) return next(err)
				return res.status(200).json({ commentID })
			})
		})
	} catch (err) { return next(err) }
}