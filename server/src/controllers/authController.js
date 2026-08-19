const User = require("../models/User");
const { generateToken } = require("../utils/jwt");
const { success, error } = require("../utils/response");

// @route POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return error(res, 400, "Nama, email, dan password wajib diisi");
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return error(res, 409, "Email sudah terdaftar");
        }

        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);

        return success(res, 201, "Registrasi berhasil", {
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        return error(res, 500, "Gagal registrasi", err);
    }
};

// @route POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return error(res, 400, "Email dan password wajib diisi");
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.comparePassword(password))) {
            return error(res, 401, "Email atau password salah");
        }

        const token = generateToken(user._id);
        return success(res, 200, "Login berhasil", {
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        return error(res, 500, "Gagal login", err);
    }
};

// @route GET /api/auth/me
const me = async (req, res) => {
    return success(res, 200, "Data user berhasil diambil", { user: req.user });
};

module.exports = { register, login, me };
