const multer = require("multer");
const fs = require("fs");
const ApiError = require("../utils/apiError");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const multerStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Only images are allowed", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadSingleImage = (fieldName) => upload.single(fieldName);

exports.uploadMixOfImages = (arrayOfFields) => upload.fields(arrayOfFields);

// Support resizing one or more images
exports.resizeImage = (fieldName, folderName) =>
  asyncHandler(async (req, res, next) => {
    const folderPath = `uploads/${folderName}`;
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    if (req.file) {
      const filename = `${folderName}-${uuidv4()}-${Date.now()}.jpeg`;
      await sharp(req.file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`${folderPath}/${filename}`);
      req.body[fieldName] = filename;
    }

    if (req.files && req.files[fieldName]) {
      req.body[fieldName] = [];
      await Promise.all(
        req.files[fieldName].map(async (file, index) => {
          const filename = `${folderName}-${uuidv4()}-${Date.now()}-${
            index + 1
          }.jpeg`;
          await sharp(file.buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`${folderPath}/${filename}`);
            
          req.body[fieldName].push(filename); 
        })
      );
    }
    
    next();
  });
