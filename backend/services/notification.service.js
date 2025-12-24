const encryptionService = require("./encryption.service");
const mailService = require("./mail.service");
const schedulerService = require("./scheduler.service");
const scraperService = require("./scraper.service");
const User = require("../models/user.model"); // MongoDB model
const Activity = require("../models/activity.model");

const registerUser = async ({
  username,
  linkedinEmail,
  linkedinPassword,
  notificationEmail
}) => {
  // 1. Encrypt LinkedIn password
  const encryptedPassword =
    encryptionService.encrypt(linkedinPassword);

  // 2. Store user in database
  const user = await User.create({
    username,
    linkedinEmail,
    encryptedPassword,
    notificationEmail
  });

  // 3. Fetch LinkedIn stats immediately (first run)
  const stats = await scraperService.fetchStats({
    linkedinEmail,
    encryptedPassword
  });

  // 4. Send first email immediately
  await mailService.sendNotificationEmail({
    to: notificationEmail,
    username,
    stats,
    isFirstRun: true
  });

  // 5. Schedule recurring job (every 3 hours)
  schedulerService.scheduleUserJob(user._id);

  return user;
};

const unsubscribeUser = async (email) => {
  // Find user by LinkedIn email or notification email
  const user = await User.findOne({
    $or: [
      { linkedinEmail: email },
      { notificationEmail: email }
    ]
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Store user details before deletion for confirmation email
  const userDetails = {
    notificationEmail: user.notificationEmail,
    username: user.username
  };

  // Delete all activity records associated with this user
  await Activity.deleteMany({ userId: user._id });

  // Delete user record from database
  await User.findByIdAndDelete(user._id);

  // Send unsubscribe confirmation email
  await mailService.sendUnsubscribeConfirmationEmail({
    to: userDetails.notificationEmail,
    username: userDetails.username
  });

  return userDetails;
};

module.exports = {
  registerUser,
  unsubscribeUser
};
