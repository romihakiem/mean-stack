require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const { success, error } = require("./utils/response");

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => success(res, 200, "Server aktif", { status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

// 404 handler
app.use((req, res) => {
    error(res, 404, "Endpoint tidak ditemukan");
});

// Error handler global
app.use((err, req, res, next) => {
    console.error(err.stack);
    error(res, 500, "Terjadi kesalahan pada server", err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
