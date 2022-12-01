const Filter = require('bad-words')
const customFilter = new Filter({ placeHolder: '*' })
const dirty_words = require("../dirty_words")
const Message = require("../models/messageModel")
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
const { validateMessage, saveMessage } = require("../middleware/messageMiddleware")

exports.list = (req, res, next) => {
	Message.find()
		.sort([["date", "descending"]])
		.exec((err, messages) => {
			if (err) return next(err)
			if (req.user) {
				const postIndex = messages.findIndex(elem => elem.username === req.user.username)
				if (postIndex !== -1) {
					const userPost = messages[postIndex]
					messages.splice(postIndex, 1)
					messages.unshift(userPost)
				}
			}
			res.json({ messages })
		})
}

exports.item = async (req, res, next) => {
	try {
		const message = await Message.findOne({ id: req.param.id })
		res.json({ message })
	} catch (err) { return next(err) }
}

exports.create_post = [
	body("message", "at least 2 characters required").isLength({ min: 2 }),
	body("message", "max 64 characters allowed").isLength({ max: 64 }),
	body("message").custom(checkInput).withMessage("Your message can not contain bad words"),
	validateMessage,
	saveMessage
]

exports.edit_post = [
	body("message", "at least 2 characters required").isLength({ min: 2 }),
	body("message", "max 64 characters allowed").isLength({ max: 64 }),
	body("message").custom(checkInput).withMessage("Your message can not contain bad words"),
	async (req, res, next) => {
		const errors = validationResult(req)
		try {
			const message = await Message.findOne({ "_id": req.params.id })
			message.message = req.body.message
			if (!errors.isEmpty()) return res.json({ errors: errors.array() })
			message.save((err) => {
				if (err) return next(err)
				res.redirect('/')
			})
		} catch (err) { return next(err) }
	}
]

exports.delete_post = (req, res, next) => {
	if (req.params.id === "") return res.status(204).send()
	Message.deleteOne({ _id: req.params.id })
		.exec((err, message) => {
			if (err) return next(err)
			res.status(204).send()
		})
}

exports.like_post = async (req, res, next) => {
	if (req.params.id === "") return res.status(204).send()
	try {
		await Message.updateOne({ _id: req.params.id }, { "$push": { likes: req.user._id } })
		await User.updateOne({ _id: req.user._id }, { "$push": { likes: req.params.id } })
		res.status(204).send()
	} catch (err) { return next(err) }
}

exports.unlike_post = async (req, res, next) => {
	if (req.params.id === "") return res.status(204).send()
	try {
		await Message.updateOne({ _id: req.params.id }, { "$pull": { likes: req.user._id } })
		await User.updateOne({ _id: req.user._id }, { "$pull": { likes: req.params.id } })
		res.status(204).send()
	} catch (err) { return next(err) }
}