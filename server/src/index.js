require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

// Error handler global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
