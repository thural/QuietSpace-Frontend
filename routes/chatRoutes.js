const express = require("express")
const router = express.Router()

const chat = require("../controllers/chatController")

// router.route("/").get(chat.list).post(chat.create_post)
// router.route("/edit/:id").post(chat.edit_post)
router.route("/send/:contact_id").post(chat.add_message) 
// router.route('/delete/:id').post(chat.delete_post)
// router.route('/like/:id').post(chat.like_post)
// router.route('/unlike/:id').post(chat.unlike_post)

module.exports = router