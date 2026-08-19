const mongoose = require("mongoose");
const { hashPassword, checkPassword } = require("../utils/password");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6, select: false },
        role: { type: String, enum: ["admin", "user"], default: "user" },
    },
    { timestamps: true },
);

userSchema.pre("save", async function hashUserPassword(next) {
    if (!this.isModified("password")) return next();
    this.password = await hashPassword(this.password);
    next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
    return checkPassword(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);
