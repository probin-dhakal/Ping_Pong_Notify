const { execFile } = require("child_process");
const path = require("path");
const encryptionService = require("./encryption.service");

const PYTHON_PATH =
  "/Users/probindhakal/Desktop/Ping_Pong_Notify/venv/bin/python";

/**
 * Fetch LinkedIn unread stats using Python Selenium script
 */
const fetchStats = async ({ linkedinEmail, encryptedPassword }) => {
  return new Promise((resolve, reject) => {
    try {
      const decryptedPassword =
        encryptionService.decrypt(encryptedPassword);

      const scriptPath = path.join(
        __dirname,
        "../../scraper/linkedin_scraper.py"
      );

      execFile(
        PYTHON_PATH,
        [
          scriptPath,
          linkedinEmail,
          decryptedPassword
        ],
        { timeout: 120000 }, // optional safety
        (error, stdout, stderr) => {
          if (error) {
            console.error("Scraper execution error:", stderr || error);
            return reject(error);
          }

          try {
            const data = JSON.parse(stdout.trim());
            resolve(data);
          } catch (parseError) {
            console.error("Raw scraper output:", stdout);
            reject("Failed to parse scraper output");
          }
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  fetchStats
};
