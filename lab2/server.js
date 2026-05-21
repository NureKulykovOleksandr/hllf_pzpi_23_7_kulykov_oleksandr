const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

let videos = [
    { 
        id: 1, 
        title: "Тестове відео (Природа)", 
        url: "https://www.w3schools.com/html/mov_bbb.mp4", 
        comments: ["Дуже гарно!"] 
    }
];

app.get("/api/videos", (req, res) => {
    res.json(videos);
});

app.post("/api/videos", upload.single('videoFile'), (req, res) => {
    const title = req.body.title;
    const url = `http://localhost:3001/uploads/${req.file.filename}`;
    
    const newVideo = { id: Date.now(), title, url, comments: [] };
    videos.push(newVideo);
    res.json(newVideo);
});

app.post("/api/videos/:id/comments", (req, res) => {
    const videoId = parseInt(req.params.id);
    const { text } = req.body;
    const video = videos.find(v => v.id === videoId);
    if (video) {
        video.comments.push(text);
        res.json(video);
    } else {
        res.status(404).send("Відео не знайдено");
    }
});

app.delete("/api/videos/:id", (req, res) => {
    const videoId = parseInt(req.params.id);
    videos = videos.filter(v => v.id !== videoId);
    res.json({ success: true });
});

app.listen(3001, () => {
    console.log("Сервер почав прослуховування на порту 3001");
});