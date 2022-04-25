const { promisify } = require('util');
const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/AppError');
const { unlink } = require('fs');

/**
 *Returns a Multer instance that provides several methods for generating middleware that process files uploaded in multipart/form-data format.
 * @param {[String]} mimetypes Type of the file
 * @param {String} fileField Name of the field of the body containing file
 */
exports.uploadFile = (mimetypes, fileField) => {
  const multerFilter = (req, file, cb) => {
    if (mimetypes.includes(file.mimetype)) cb(null, true);
    else cb(new AppError(400, 'Invalid file format!'), false);
  };
  const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: multerFilter,
  });

  return upload.single(fileField);
};

/**
 * @param {String} fileField Field of the body containing file
 * @param {String} toFormat Desired format of the file
 * @param {String} destination Path of the folder to store filrs
 * - Before using resizeFile, set req.fileName
 */
exports.resizeFile =
  (fileField, toFormat, destination) => async (req, res, next) => {
    // if (!req.file) return next(new AppError(404, 'No file found to upload!'));
    if (!req.file) return next();

    //set path on body
    req.body[fileField] = req.file.filename = `${req.fileName}.${toFormat}`;

    try {
      await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat(toFormat)
        .jpeg({ quality: 90 })
        .toFile(`${destination}/${req.file.filename}`);
      next();
    } catch (err) {
      next(err);
    }
  };

/** - Before using deleteFile, set req.filePath  */
exports.deleteFile = async (req, res, next) => {
  try {
    await promisify(unlink)(req.filePath);
    next();
  } catch (err) {
    if (err.code === 'ENOENT')
      return next(new AppError(400, 'File not exists!'));
    next(err);
  }
};
