const scraperService = require("./scraper.service");
const mailService = require("./mail.service");
const User = require("../models/user.model");
const Activity = require("../models/activity.model");

/**
 * Run scheduled LinkedIn notification job for a user
 */
const run = async (userId) => {
  // 1. Fetch user from DB
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // 2. Fetch latest LinkedIn stats
  const currentStats = await scraperService.fetchStats({
    linkedinEmail: user.linkedinEmail,
    encryptedPassword: user.encryptedPassword
  });

  // 3. Fetch previous stats (if any)
  const previousStats = await Activity.findOne({ userId })
    .sort({ createdAt: -1 })
    .limit(1);

  // 4. Compute deltas
  const deltaMessages = previousStats
    ? currentStats.messages - previousStats.messages
    : "N/A";

  const deltaNotifications = previousStats
    ? currentStats.notifications - previousStats.notifications
    : "N/A";

  // 5. Store current stats in DB
  await Activity.create({
    userId,
    messages: currentStats.messages,
    notifications: currentStats.notifications
  });

  // 6. Send notification email
  await mailService.sendNotificationEmail({
    to: user.notificationEmail,
    username: user.username,
    stats: {
      messages: currentStats.messages,
      notifications: currentStats.notifications,
      deltaMessages,
      deltaNotifications
    },
    isFirstRun: false
  });
};

module.exports = {
  run
};
