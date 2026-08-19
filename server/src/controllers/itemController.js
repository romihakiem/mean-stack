const Item = require("../models/Item");
const { getPagination, buildMeta } = require("../utils/pagination");
const { success, error } = require("../utils/response");

// @route GET /api/items
const getItems = async (req, res) => {
    try {
        const { search } = req.query;
        const filter = search ? { name: { $regex: search, $options: "i" } } : {};

        const { page, limit, skip } = getPagination(req.query);

        const [items, total] = await Promise.all([Item.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit), Item.countDocuments(filter)]);

        return success(res, 200, "Daftar item berhasil diambil", {
            items,
            ...buildMeta(total, page, limit),
        });
    } catch (err) {
        return error(res, 500, "Gagal mengambil data item", err);
    }
};

// @route GET /api/items/:id
const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return error(res, 404, "Item tidak ditemukan");
        return success(res, 200, "Detail item berhasil diambil", { item });
    } catch (err) {
        return error(res, 500, "Gagal mengambil detail item", err);
    }
};

// @route POST /api/items
const createItem = async (req, res) => {
    try {
        const { name, description, category, price, stock, status } = req.body;
        if (!name) return error(res, 400, "Nama item wajib diisi");

        const item = await Item.create({
            name,
            description,
            category,
            price,
            stock,
            status,
            owner: req.user._id,
        });

        return success(res, 201, "Item berhasil dibuat", { item });
    } catch (err) {
        return error(res, 500, "Gagal membuat item", err);
    }
};

// @route PUT /api/items/:id
const updateItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!item) return error(res, 404, "Item tidak ditemukan");
        return success(res, 200, "Item berhasil diperbarui", { item });
    } catch (err) {
        return error(res, 500, "Gagal memperbarui item", err);
    }
};

// @route DELETE /api/items/:id
const deleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) return error(res, 404, "Item tidak ditemukan");
        return success(res, 200, "Item berhasil dihapus");
    } catch (err) {
        return error(res, 500, "Gagal menghapus item", err);
    }
};

module.exports = { getItems, getItemById, createItem, updateItem, deleteItem };
