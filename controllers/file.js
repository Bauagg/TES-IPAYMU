const fs = require('fs');
const path = require('path');
const File = require('../models/file');

module.exports = {
    fileList: async (req, res, next) => {
        try {
            const { name } = req.query

            let query = {}

            if (name) {
                query.filename = { $regex: new RegExp(name, 'i') };
            }

            const data = await File.find(query)

            return res.status(200).json({
                error: false,
                message: "get lits file success",
                data
            })

        } catch (error) {
            console.log(error)
            next(error)
        }
    },

    fileUploadController: async (req, res, next) => {
        try {
            const files = req.files;
            const file = files ? files.file : null;

            // Validasi apakah file diunggah
            if (!file) {
                return res.status(400).json({ error: true, message: "No file uploaded. Please upload a file." });
            }

            // Validasi tipe file
            const allowedExtensions = /jpg|jpeg|png|pdf|txt/;
            const extname = allowedExtensions.test(path.extname(file.name).toLowerCase());
            const mimetype = allowedExtensions.test(file.mimetype);

            if (!mimetype || !extname) {
                return res.status(400).json({ error: true, message: 'Invalid file type. Only JPG, PNG, PDF, and TXT files are allowed.' });
            }

            // Validasi ukuran file (maksimum 10MB)
            if (file.size > 10 * 1024 * 1024) {
                return res.status(400).json({ error: true, message: 'File size exceeds the limit of 10MB.' });
            }

            // Nama unik untuk file yang diunggah
            const imageName = `${Date.now()}${path.extname(file.name)}`;
            const imagePath = path.join(__dirname, '../public/uploads', imageName);

            // Simpan file di direktori uploads
            await file.mv(imagePath);

            // URL akses file
            const fileUrl = `${req.protocol}://${req.get('host')}/public/uploads/${imageName}`;

            // Simpan metadata file ke database
            const data = await File.create({
                filename: file.name,
                fileUrl: fileUrl,
                size: file.size,
            });

            // Mengembalikan respons sukses
            return res.status(200).json({
                error: false,
                message: "File uploaded and saved successfully",
                data,
            });
        } catch (err) {
            console.error(err);
            next(err);
        }
    },

    updateFile: async (req, res, next) => {
        try {
            const files = req.files;
            const file = files ? files.file : null;

            // Validasi apakah file diunggah
            if (!file) {
                return res.status(400).json({ error: true, message: "No file uploaded. Please upload a file." });
            }

            const validateDate = await File.findById(req.params.id)
            if (!validateDate) {
                return res.status(404).json({ error: false, message: "data not found" })
            }

            // Ambil path file lama dan hapus file tersebut
            const oldFilePath = path.join(__dirname, '../public/uploads', path.basename(validateDate.fileUrl));
            fs.unlink(oldFilePath, (err) => {
                if (err) {
                    return res.status(500).json({ error: true, message: 'Failed to delete old file.' });
                }
            });

            // Validasi tipe file
            const allowedExtensions = /jpg|jpeg|png|pdf|txt/;
            const extname = allowedExtensions.test(path.extname(file.name).toLowerCase());
            const mimetype = allowedExtensions.test(file.mimetype);

            if (!mimetype || !extname) {
                return res.status(400).json({ error: true, message: 'Invalid file type. Only JPG, PNG, PDF, and TXT files are allowed.' });
            }

            // Validasi ukuran file (maksimum 10MB)
            if (file.size > 10 * 1024 * 1024) {
                return res.status(400).json({ error: true, message: 'File size exceeds the limit of 10MB.' });
            }

            // Nama unik untuk file yang diunggah
            const imageName = `${Date.now()}${path.extname(file.name)}`;
            const imagePath = path.join(__dirname, '../public/uploads', imageName);

            // Simpan file di direktori uploads
            await file.mv(imagePath);

            // URL akses file
            const fileUrl = `${req.protocol}://${req.get('host')}/public/uploads/${imageName}`;

            // Simpan metadata file ke database
            const data = await File.findByIdAndUpdate(req.params.id, {
                filename: file.name,
                fileUrl: fileUrl,
                size: file.size,
            }, { new: true });

            // Mengembalikan respons sukses
            return res.status(200).json({
                error: false,
                message: "File uploaded and saved successfully",
                data,
            });
        } catch (err) {
            console.error(err);
            next(err);
        }
    },

    deleteFile: async (req, res, next) => {
        try {
            const validateDate = await File.findById(req.params.id)
            if (!validateDate) {
                return res.status(404).json({ error: false, message: "data not found" })
            }

            // Ambil path file lama dan hapus file tersebut
            const oldFilePath = path.join(__dirname, '../public/uploads', path.basename(validateDate.fileUrl));
            fs.unlink(oldFilePath, (err) => {
                if (err) {
                    return res.status(500).json({ error: true, message: 'Failed to delete old file.' });
                }
            });

            await File.deleteOne({ _id: req.params.id })

            return res.status(200).json({
                error: false,
                message: "File delete successfully",
            });
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}
