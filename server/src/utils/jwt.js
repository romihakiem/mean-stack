const jwt = require("jsonwebtoken");

/**
 * Membuat JWT baru untuk user id tertentu.
 * @param {string} id - ID user (biasanya _id dari MongoDB)
 * @returns {string} token JWT
 */
const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

/**
 * Memverifikasi JWT dan mengembalikan payload-nya.
 * Melempar error jika token tidak valid atau kedaluwarsa.
 * @param {string} token
 * @returns {object} payload token (mis. { id, iat, exp })
 */
const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { generateToken, verifyToken };
