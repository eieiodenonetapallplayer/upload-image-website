const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

const uploadFolder = path.join(__dirname, 'data');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const randomName = crypto.randomBytes(16).toString('hex');
        cb(null, randomName + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('อนุญาตเฉพาะไฟล์ .png และ .webp เท่านั้น!'), false);
    }
};

const upload = multer({ storage, fileFilter });

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            status: false,
            message: 'ไม่มีไฟล์ที่อัปโหลดหรือชนิดไฟล์ไม่รองรับ'
        });
    }

    const filePath = path.join('/data', req.file.filename);
    res.json({
        status: true,
        message: 'อัปโหลดไฟล์สำเร็จ',
        filePath
    });
});

app.listen(PORT, () => {
    console.log('เซิร์ฟเวอร์กำลังทำงานที่พอร์ต', PORT);
});