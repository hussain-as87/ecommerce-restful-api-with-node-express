import multer from "multer";
import { ApiError } from "../utils/apiError.js";
const multerOptions = () => {
  //1-disk storage engine

  /* const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/categories");
  },
  filename: (req, file, cb) => {
    //category-{id}-date.now.extension
    const ext = file.mimetype.split("/")[1];
    const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
    cb(null, filename);
  },
}); */

  //2-memory storage engine
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("only image allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};
/**
 * upload single image
 */
export const uploadSingleImage = (fieldName) =>
  multerOptions().single(fieldName);
/**
 * upload multi image & single image
 */
export const uploadmixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
