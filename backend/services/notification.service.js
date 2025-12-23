const encryptionService = require("./encryption.service");
const mailService = require("./mail.service");
const schedulerService = require("./scheduler.service");
const scraperService = require("./scraper.service");
const User = require("../models/user.model"); // MongoDB model

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

module.exports = {
  registerUser
};
