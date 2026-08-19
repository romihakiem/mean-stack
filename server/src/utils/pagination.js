/**
 * Mengambil parameter pagination dari query string dan menormalkannya.
 * @param {object} query - req.query (mis. { page, limit })
 * @returns {{ page: number, limit: number, skip: number }}
 */
const getPagination = (query = {}) => {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

/**
 * Membangun metadata pagination untuk disertakan dalam response.
 * @param {number} total - total dokumen yang cocok dengan filter
 * @param {number} page - halaman saat ini
 * @param {number} limit - jumlah item per halaman
 * @returns {{ total: number, page: number, limit: number, totalPages: number, hasPrevPage: boolean, hasNextPage: boolean }}
 */
const buildMeta = (total, page, limit) => {
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    return {
        total,
        page,
        limit,
        totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
    };
};

module.exports = { getPagination, buildMeta };
