/**
 * Mengirim response sukses dengan format konsisten.
 * @param {import('express').Response} res
 * @param {number} statusCode - kode status HTTP (default 200)
 * @param {string} message - pesan singkat
 * @param {object} data - payload tambahan, di-spread ke root response
 */
const success = (res, statusCode = 200, message = "Berhasil", data = {}) => res.status(statusCode).json({ success: true, message, ...data });

/**
 * Mengirim response error dengan format konsisten.
 * @param {import('express').Response} res
 * @param {number} statusCode - kode status HTTP (default 500)
 * @param {string} message - pesan error yang aman ditampilkan ke user
 * @param {string|Error} [err] - detail error opsional (mis. err.message)
 */
const error = (res, statusCode = 500, message = "Terjadi kesalahan", err) =>
    res.status(statusCode).json({
        success: false,
        message,
        ...(err ? { error: err instanceof Error ? err.message : err } : {}),
    });

module.exports = { success, error };
