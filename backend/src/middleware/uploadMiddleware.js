import multer from "multer";
import path from "path";
import fs from "fs";

// Create upload folders if they don't exist
const directories = [
  "uploads/university",
  "uploads/cnic",
  "uploads/profile",
];

directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "universityIdCard") {
      cb(null, "uploads/university");
    } else if (
      file.fieldname === "cnicFront" ||
      file.fieldname === "cnicBack"
    ) {
      cb(null, "uploads/cnic");
    } else if (file.fieldname === "profileImage") {
      cb(null, "uploads/profile");
    } else {
      cb(null, "uploads");
    }
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png/;

  const ext = allowed.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mime = allowed.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG and PNG images are allowed."));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

export default upload;