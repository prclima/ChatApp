const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../Controllers/UserControllers.js");
const router = express.Router();
const { protect } = require("../Midlleware/Auth.js");

router.route("/").post(registerUser);
router.route("/login").post(authUser);
router.route("/").get(protect, allUsers);

module.exports = router;
