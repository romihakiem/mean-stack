const express = require("express");
const { getItems, getItemById, createItem, updateItem, deleteItem } = require("../controllers/itemController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect); // semua endpoint item wajib login

router.get("/", getItems);
router.get("/:id", getItemById);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;
