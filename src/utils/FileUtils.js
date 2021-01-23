class FileUtils {
    static #IMAGE_REC = '.ai.bmp.gif.ico.jpeg.jpg.png.ps.psd.svg.tif.tiff';
    static #VIDEO_REC = '.3g2.3gp.avi.flv.h264.m4v.mkv.mov.mp4.mpg.mpeg.rm.swf.vob.wmv';
    static #AUDIO_REC = '.aif.cda.mid.midi.mp3.mpa.ogg.wav.wma.wpl';
    static #COMPRESSED_REC = '.7z.arj.deb.pkg.rar.rpm.tar.gz.z.zip';
    static #DOCUMENT_REC = '.doc.docx.odt.pdf.rtf.tex.wpd.ods.xls.xlsm.xlsx.key.odp.pps.ppt.pptx';
    static #TEXT_REC = '.c.cpp.cs.h.java.php.py.sh.swift.vb.js.csv.log.sql.xml.txt';

    static IMAGE = 'IMAGE';
    static VIDEO = 'VIDEO';
    static AUDIO = 'AUDIO';
    static COMPRESSED = 'COMPRESSED';
    static DOCUMENT = 'DOCUMENT';
    static TEXT = 'TEXT';

    static DIFF = 'DIFF';

    // path/file/a.png => path/file
    static getPath(filePath) {
        return filePath.substring(0, filePath.lastIndexOf('/'));
    }

    // path/file/a.png => a.png
    static getFileName(filePath) {
        return filePath.substring(filePath.lastIndexOf('/') + 1);
    }

    // path/file/a.png => .png
    static getFileExtension(filePath) {
        const fileName = FileUtils.getFileName(filePath);
        return fileName.substring(fileName.lastIndexOf('.') + 1);
    }

    // type in private field above
    static getFileType(filePath) {
        const fileExt = FileUtils.getFileExtension(filePath);
        if (this.#IMAGE_REC.includes(fileExt)) {
            return FileUtils.IMAGE;
        } else if (this.#VIDEO_REC.includes(fileExt)) {
            return FileUtils.VIDEO;
        } else if (this.#AUDIO_REC.includes(fileExt)) {
            return FileUtils.AUDIO;
        } else if (this.#COMPRESSED_REC.includes(fileExt)) {
            return FileUtils.COMPRESSED;
        } else if (this.#DOCUMENT_REC.includes(fileExt)) {
            return FileUtils.DOCUMENT;
        } else if (this.#TEXT_REC.includes(fileExt)) {
            return FileUtils.TEXT;
        } else {
            return FileUtils.DIFF;
        }
    }

    // path/file/a.png => a-${prefix}.png
    static genFileName(filePath, prefix = Date.now()) {
        const fileName = FileUtils.getFileName(filePath);
        const lastDot = fileName.lastIndexOf('.');
        if (lastDot !== -1) {
            return `${fileName.substring(
                0,
                lastDot,
            )}-${prefix}${fileName.substring(lastDot)}`;
        } else {
            return `${fileName}-${prefix}`;
        }
    }

    static getFileInfo(filePath) {
        return {
            path: FileUtils.getPath(filePath),
            name: FileUtils.getFileName(filePath),
            ext: FileUtils.getFileExtension(filePath),
            type: FileUtils.getFileType(filePath),
            genName: FileUtils.genFileName(filePath),
        };
    }

    static
}

module.exports = FileUtils;
