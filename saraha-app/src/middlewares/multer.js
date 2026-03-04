import multer, { diskStorage } from "multer";
import fs from "fs/promises";
import { constants } from "fs";
import { resolve } from "path";

export const fileTypes = {
  image: ["image/jpeg", "image/png", "image/jpeg"],
  video: ["video/mp4", "video/mpeg", "video/quicktime"],
};

export const upload = ({ dest = "general", validation = fileTypes.image }) => {
  const storage = diskStorage({
    destination: async (req, file, cb) => {
      const finalPath = `./uploads/${dest}`;
      const folderPath = resolve(finalPath);

      try {
        await fs.access(folderPath, constants.F_OK);
      } catch (error) {
        await fs.mkdir(folderPath, { recursive: true });
      }

      file.finalPath = finalPath;
      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      const fileName = `${Date.now()}.${file.originalname}`;
      file.finalPath += `/${fileName}`;
      cb(null, fileName);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (validation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file format"), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
  });
};
