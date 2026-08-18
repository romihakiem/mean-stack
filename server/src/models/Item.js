const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        category: { type: String, default: "Umum" },
        price: { type: Number, default: 0, min: 0 },
        stock: { type: Number, default: 0, min: 0 },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Item", itemSchema);
