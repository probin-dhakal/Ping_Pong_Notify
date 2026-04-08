const Activity = require("../models/activity.model");
const { sendLinkedinDigestMail } = require("../services/mail.service");

const handleLinkedinScrapeResult = async (payload) => {
  const { activityId, status, stats, error } = payload || {};
  if (!activityId) return;

  const update = {
    status: status || "FAILED",
    stats: stats || null,
    error: error || null,
    completedAt: new Date(),
  };

  const activity = await Activity.findByIdAndUpdate(activityId, update, { new: true });
  if (!activity) return;

  if (status === "SUCCESS") {
    await sendLinkedinDigestMail(activity.userId, stats);
  } else if (status === "AUTH_FAILED") {
    await sendLinkedinDigestMail(activity.userId, null, { authFailed: true });
  }
};

module.exports = { handleLinkedinScrapeResult };