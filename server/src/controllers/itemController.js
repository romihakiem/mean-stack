const Item = require("../models/Item");

// @route GET /api/items
const getItems = async (req, res) => {
    try {
        const { search } = req.query;
        const filter = search
            ? { name: { $regex: search, $options: "i" } }
            : {};

        const items = await Item.find(filter).sort({ createdAt: -1 });
        res.json({ items, total: items.length });
    } catch (err) {
        res.status(500).json({
            message: "Gagal mengambil data item",
            error: err.message,
        });
    }
};

// @route GET /api/items/:id
const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item)
            return res.status(404).json({ message: "Item tidak ditemukan" });
        res.json({ item });
    } catch (err) {
        res.status(500).json({
            message: "Gagal mengambil detail item",
            error: err.message,
        });
    }
};

// @route POST /api/items
const createItem = async (req, res) => {
    try {
        const { name, description, category, price, stock, status } = req.body;
        if (!name)
            return res.status(400).json({ message: "Nama item wajib diisi" });

        const item = await Item.create({
            name,
            description,
            category,
            price,
            stock,
            status,
            owner: req.user._id,
        });

        res.status(201).json({ item });
    } catch (err) {
        res.status(500).json({
            message: "Gagal membuat item",
            error: err.message,
        });
    }
};

// @route PUT /api/items/:id
const updateItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!item)
            return res.status(404).json({ message: "Item tidak ditemukan" });
        res.json({ item });
    } catch (err) {
        res.status(500).json({
            message: "Gagal memperbarui item",
            error: err.message,
        });
    }
};

// @route DELETE /api/items/:id
const deleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item)
            return res.status(404).json({ message: "Item tidak ditemukan" });
        res.json({ message: "Item berhasil dihapus" });
    } catch (err) {
        res.status(500).json({
            message: "Gagal menghapus item",
            error: err.message,
        });
    }
};

module.exports = { getItems, getItemById, createItem, updateItem, deleteItem };
