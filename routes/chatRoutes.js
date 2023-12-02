const express = require("express")
const router = express.Router()
const chat = require("../controllers/chatController")

router.route("/").get(chat.load)
router.route("/send/:contactID").post(chat.add_message)



module.exports = router