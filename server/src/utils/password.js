const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

/**
 * Meng-hash password plaintext.
 * @param {string} plainPassword
 * @returns {Promise<string>} hash password
 */
const hashPassword = async (plainPassword) => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(plainPassword, salt);
};

/**
 * Membandingkan password plaintext dengan hash yang tersimpan.
 * @param {string} plainPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
const checkPassword = (plainPassword, hashedPassword) => bcrypt.compare(plainPassword, hashedPassword);

module.exports = { hashPassword, checkPassword };
