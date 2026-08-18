const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ")
            ? header.split(" ")[1]
            : null;

        if (!token) {
            return res
                .status(401)
                .json({ message: "Tidak ada token, akses ditolak" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res
                .status(401)
                .json({ message: "User untuk token ini tidak ditemukan" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res
            .status(401)
            .json({ message: "Token tidak valid atau kedaluwarsa" });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Akses khusus admin" });
    }
    next();
};

module.exports = { protect, adminOnly };
