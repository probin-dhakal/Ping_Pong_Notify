const notificationService = require("../services/notification.service");

const register = async (req, res) => {
  try {
    const {
      username,
      linkedinEmail,
      linkedinPassword,
      notificationEmail
    } = req.body;

    // Basic validation
    if (
      !username ||
      !linkedinEmail ||
      !linkedinPassword ||
      !notificationEmail
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    await notificationService.registerUser({
      username,
      linkedinEmail,
      linkedinPassword,
      notificationEmail
    });

    return res.status(201).json({
      message:
        "Registration successful. You will receive an email immediately and then every 3 hours."
    });
  } catch (error) {
    console.error("Register Controller Error:", error);
    return res.status(500).json({
      message: "User registration failed"
    });
  }
};

module.exports = {
  register
};
