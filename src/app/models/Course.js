const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const CourseSchema = new Schema(
    {
        name: { type: String, require: true },
        shortDescription: {
            type: String,
            default: 'Chưa có mô tả ngắn',
            maxlength: 600,
        },
        description: { type: String, default: 'Chưa có mô tả chi tiết' },
        author: { type: String, default: 'Tuan Nguyen' },
        comment: { type: Number, default: 0 },
        time: { type: Number, default: 1 },
        leanWhat: { type: String },
        require: { type: String, default: 'Không có yêu cầu gì' },
        image: { type: String },
        slug: { type: String, slug: 'name', unique: true },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Course', CourseSchema);
