const cron = require("node-cron");
const notificationJob = require("./scheduledJob.service");

/**
 * Schedule LinkedIn notification job for a user
 * Runs every 3 hours
 */
const scheduleUserJob = (userId) => {
  cron.schedule("0 */3 * * *", async () => {
    try {
      console.log(`Running scheduled job for user: ${userId}`);
      await notificationJob.run(userId);
    } catch (error) {
      console.error("Scheduled job error:", error);
    }
  });
};

module.exports = {
  scheduleUserJob
};
