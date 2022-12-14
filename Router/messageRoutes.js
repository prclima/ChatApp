const express = require("express")
const { sendMessage, allMessages} = require("../Controllers/messageControllers.js")
const { protect } = require("../Midlleware/Auth.js")
const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);


module.exports = router;