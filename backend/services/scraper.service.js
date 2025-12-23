const { execFile } = require("child_process");
const path = require("path");
const encryptionService = require("./encryption.service");

/**
 * Fetch LinkedIn unread stats using Python Selenium script
 */
const fetchStats = async ({ linkedinEmail, encryptedPassword }) => {
  return new Promise((resolve, reject) => {
    try {
      // Decrypt password ONLY at runtime
      const decryptedPassword =
        encryptionService.decrypt(encryptedPassword);

      const scriptPath = path.join(
        __dirname,
        "../../scraper/linkedin_scraper.py"
      );

      execFile(
        "python",
        [
          scriptPath,
          linkedinEmail,
          decryptedPassword
        ],
        (error, stdout, stderr) => {
          if (error) {
            console.error("Scraper execution error:", stderr);
            return reject(error);
          }

          try {
            const data = JSON.parse(stdout);
            resolve(data);
          } catch (parseError) {
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
