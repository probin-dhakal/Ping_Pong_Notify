const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

/**
 * Create reusable mail transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD
    }
  });
};

/**
 * Create Mailgen instance
 */
const createMailGenerator = () => {
  return new Mailgen({
    theme: "default",
    product: {
      name: "LinkedIn Notifier",
      link: "https://your-app-url.com"
    }
  });
};

/**
 * Send LinkedIn notification email
 */
const sendNotificationEmail = async ({
  to,
  username,
  stats,
  isFirstRun = false
}) => {
  const transporter = createTransporter();
  const mailGenerator = createMailGenerator();

  const tableData = [
    {
      Metric: "Unread Messages",
      Current: stats.messages,
      Change: stats.deltaMessages ?? "N/A"
    },
    {
      Metric: "Unread Notifications",
      Current: stats.notifications,
      Change: stats.deltaNotifications ?? "N/A"
    }
  ];

  const emailBody = {
    body: {
      name: username,
      intro: isFirstRun
        ? "Your LinkedIn notification service is now active. Here is your current activity summary:"
        : "Here is your latest LinkedIn activity summary:",
      table: {
        data: tableData
      },
      outro: "You will continue to receive updates every 3 hours."
    }
  };

  const emailHtml = mailGenerator.generate(emailBody);

  const message = {
    from: EMAIL,
    to,
    subject: isFirstRun
      ? "LinkedIn Notifications – Setup Successful"
      : "LinkedIn Notifications – Activity Update",
    html: emailHtml
  };

  await transporter.sendMail(message);
};

module.exports = {
  sendNotificationEmail
};
