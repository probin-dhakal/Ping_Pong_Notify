const CryptoJS = require("crypto-js");

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

/**
 * Encrypts sensitive text (LinkedIn password)
 * @param {string} plainText
 * @returns {string} encryptedText
 */
const encrypt = (plainText) => {
  if (!plainText) return null;

  return CryptoJS.AES.encrypt(
    plainText,
    ENCRYPTION_KEY
  ).toString();
};

/**
 * Decrypts encrypted text at runtime (for Selenium login)
 * @param {string} encryptedText
 * @returns {string} decryptedText
 */
const decrypt = (encryptedText) => {
  if (!encryptedText) return null;

  const bytes = CryptoJS.AES.decrypt(
    encryptedText,
    ENCRYPTION_KEY
  );

  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = {
  encrypt,
  decrypt
};
