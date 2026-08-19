const User = require("../models/User");
const { verifyToken } = require("../utils/jwt");
const { error } = require("../utils/response");

const protect = async (req, res, next) => {
    try {
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

        if (!token) {
            return error(res, 401, "Tidak ada token, akses ditolak");
        }

        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id);

        if (!user) {
            return error(res, 401, "User untuk token ini tidak ditemukan");
        }

        req.user = user;
        next();
    } catch (err) {
        return error(res, 401, "Token tidak valid atau kedaluwarsa");
    }
};

const adminOnly = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return error(res, 403, "Akses khusus admin");
    }
    next();
};

module.exports = { protect, adminOnly };
