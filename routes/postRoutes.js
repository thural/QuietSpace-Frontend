const express = require("express")
const router = express.Router()

const post = require("../controllers/postController")

router.route("/").get(post.list).post(post.create_post)
router.route("/:id").get(post.item)
router.route("/:id/comments").post(post.add_comment)
router.route("/edit/:id").post(post.edit_post)
router.route('/delete/:id').post(post.delete_post)
router.route('/:postID/comments/delete/:commentID').post(post.delete_comment)
router.route('/like/:id').post(post.like_post)
router.route('/unlike/:id').post(post.unlike_post)

module.exports = router