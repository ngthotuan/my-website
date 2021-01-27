const fs = require('fs');
require('dotenv').config();

const FileUpload = require('../models/FileUpload');
const FileUtils = require('../../utils/FileUtils');

const uploadDir = process.env.UPLOAD_PATH || 'uploads';
const uploadStatic = process.env.UPLOAD_STATIC || 'uploads';

class UploadController {
    // GET /upload
    getUpload(req, res) {
        res.render('upload', { title: 'Upload File' });
    }

    // POST /upload
    async uploadSingle(req, res, next) {
        const saveFile = await this.saveFile(req);
        if (saveFile.status) {
            res.render('upload/success', {
                title: 'Upload success',
                fileName: saveFile.data.originName,
                fileUrl: saveFile.data.fullSharePath,
            });
        } else {
            res.render('upload/error', {
                title: 'Error!',
                errorMessage: saveFile.message,
            });
        }
    }

    async saveFile(req) {
        const result = {
            status: false,
            message: '',
            data: null,
        };
        if (req.file) {
            const { originalname, path, mimetype, size } = req.file;
            const now = Date.now();
            const newName = FileUtils.genFileName(originalname, now);
            const fileType = FileUtils.getFileType(originalname);
            const newPath = `${uploadDir}/${fileType.toLowerCase()}`;
            const newFilePath = `${newPath}/${newName}`;
            const sharePath = `${uploadStatic}/${fileType.toLowerCase()}/${now}/${originalname}`.replace(/ /g, '%20');
            if (!fs.existsSync(newPath)) {
                fs.mkdirSync(newPath);
            }
            const fileUpload = new FileUpload({
                originName: originalname,
                name: newName,
                size: size,
                savePath: newFilePath,
                sharePath: sharePath,
                fullSharePath: `${req.headers.origin}/${sharePath}`,
                ext: FileUtils.getFileExtension(originalname),
                mimetype: mimetype,
                type: fileType,
                author: req.username,
            });

            fs.renameSync(path, newFilePath);
            try {
                await fileUpload.save();
                result.status = true;
                result.message = 'Success';
                result.data = fileUpload;
            } catch (err) {
                result.message = `Error when save file to database. ${err.message}`;
            }
        } else {
            result.message = 'No file selected';
        }

        return result;
    }
}

module.exports = new UploadController();
