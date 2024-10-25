const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
    filename: {
        type: String,
        required: [true, 'filename harus di isi'],
    },
    fileUrl: {
        type: String,
        required: [true, 'fileUrl harus di isi'],
    },
    size: {
        type: Number,
        required: [true, 'size harus di isi'],
    }
}, { timestamps: true });

module.exports = mongoose.model('File', FileSchema);
