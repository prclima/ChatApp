const express = require("express")
const { acessChat, fetchChats, createGroupChat, addToGroup, removeFromGroup} = require("../Controllers/chatControllers.js")
const { protect } = require("../Midlleware/Auth.js")
const router = express.Router();

router.route("/").post(protect, acessChat);
router.route("/").get(protect, fetchChats);



module.exports = router;