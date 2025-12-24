const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: String,
    linkedinEmail: String,
    encryptedPassword: String,
    notificationEmail: String,
    isSubscribed: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
