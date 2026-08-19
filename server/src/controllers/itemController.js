const Item = require("../models/Item");

// @route GET /api/items
const getItems = async (req, res) => {
    try {
        const { search } = req.query;
        const filter = search ? { name: { $regex: search, $options: "i" } } : {};

        // Pagination: ?page=1&limit=10 (default page=1, limit=10, maksimal limit=100)
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([Item.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit), Item.countDocuments(filter)]);

        const totalPages = Math.max(Math.ceil(total / limit), 1);

        res.json({
            items,
            total,
            page,
            limit,
            totalPages,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
        });
    } catch (err) {
        res.status(500).json({ message: "Gagal mengambil data item", error: err.message });
    }
};

// @route GET /api/items/:id
const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item tidak ditemukan" });
        res.json({ item });
    } catch (err) {
        res.status(500).json({ message: "Gagal mengambil detail item", error: err.message });
    }
};

// @route POST /api/items
const createItem = async (req, res) => {
    try {
        const { name, description, category, price, stock, status } = req.body;
        if (!name) return res.status(400).json({ message: "Nama item wajib diisi" });

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
        res.status(500).json({ message: "Gagal membuat item", error: err.message });
    }
};

// @route PUT /api/items/:id
const updateItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!item) return res.status(404).json({ message: "Item tidak ditemukan" });
        res.json({ item });
    } catch (err) {
        res.status(500).json({ message: "Gagal memperbarui item", error: err.message });
    }
};

// @route DELETE /api/items/:id
const deleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: "Item tidak ditemukan" });
        res.json({ message: "Item berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: "Gagal menghapus item", error: err.message });
    }
};

module.exports = { getItems, getItemById, createItem, updateItem, deleteItem };
