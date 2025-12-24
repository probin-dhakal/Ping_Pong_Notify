const express = require("express");
const router = express.Router();

const { register, unsubscribe } = require("../controllers/notification.controller");

// Register user route
router.post("/notifications/register", register);

// Unsubscribe user route
router.post("/notifications/unsubscribe", unsubscribe);

module.exports = router;
