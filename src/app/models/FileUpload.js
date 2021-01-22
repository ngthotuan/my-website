const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const FileUploadSchema = new Schema(
    {
        originName: String,
        name: String,
        size: Number,
        savePath: String,
        sharePath: String,
        fullSharePath: String,
        ext: String,
        mimetype: String,
        type: String,
        author: { type: String, default: 'anonymous' },
        isShare: { type: Boolean, default: true },
        group: { type: String },
    },
    { timestamps: true },
);

module.exports = mongoose.model('FileUpload', FileUploadSchema);
