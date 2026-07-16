import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(
            new Error("Unsupported file type"),
            false
        );
    }

    cb(null, true);
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});