const user = require("../controllers/user")
const express = require("express")
const router = express.Router()

router.route("/sign-up").get(user.create_get).post(user.create_post)
router.route("/log-in").get(user.login_get).post(user.login_post)

module.exports = router