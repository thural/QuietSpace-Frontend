const user = require("../controllers/userController")
const express = require("express")
const router = express.Router()

router.route("/sign-up").post(user.create_post)
router.route("/log-in").post(user.login_post)
router.route("/log-out").get(user.logout_get)
router.route("/user").get(user.user_get)

module.exports = router