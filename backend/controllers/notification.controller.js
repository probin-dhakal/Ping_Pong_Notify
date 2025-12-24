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

const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Basic validation
    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    await notificationService.unsubscribeUser(email);

    return res.status(200).json({
      message: "You have been successfully unsubscribed. A confirmation email has been sent."
    });
  } catch (error) {
    console.error("Unsubscribe Controller Error:", error);
    
    if (error.message === "User not found") {
      return res.status(404).json({
        message: "Email not found. Please check and try again."
      });
    }

    return res.status(500).json({
      message: "Unsubscribe failed. Please try again later."
    });
  }
};

module.exports = {
  register,
  unsubscribe
};
