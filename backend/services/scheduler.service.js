const cron = require("node-cron");
const notificationJob = require("./scheduledJob.service");

const scheduledJobs = new Map();

/**
 * Schedule LinkedIn notification job for a user
 * Runs every 3 hours
 */
const scheduleUserJob = (userId) => {
  const userKey = userId.toString();

  if (scheduledJobs.has(userKey)) {
    scheduledJobs.get(userKey).stop();
    scheduledJobs.delete(userKey);
  }

  const task = cron.schedule("0 */3 * * *", async () => {
    try {
      console.log(`Running scheduled job for user: ${userId}`);
      await notificationJob.run(userId);
    } catch (error) {
      console.error("Scheduled job error:", error);
    }
  });

  scheduledJobs.set(userKey, task);

  return task;
};

const cancelUserJob = (userId) => {
  const userKey = userId.toString();
  const task = scheduledJobs.get(userKey);

  if (!task) {
    return false;
  }

  task.stop();
  scheduledJobs.delete(userKey);
  return true;
};

module.exports = {
  scheduleUserJob,
  cancelUserJob
};
