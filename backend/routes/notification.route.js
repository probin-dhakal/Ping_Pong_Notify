const express = require("express");
const router = express.Router();

const { register } = require("../controllers/notification.controller");

// Register user route
router.post("/notifications/register", register);

module.exports = router;
