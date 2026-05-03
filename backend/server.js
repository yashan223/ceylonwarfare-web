import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;


const UPLOAD_DIR = path.join(__dirname, 'uploads');
const METADATA_FILE = path.join(__dirname, 'music.json');


if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/music', express.static(UPLOAD_DIR));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const ign = req.body.ign || 'unknown';
        const cleanIgn = ign.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        cb(null, `${cleanIgn}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'audio/mpeg' || file.originalname.endsWith('.mp3')) {
            cb(null, true);
        } else {
            cb(new Error('Only MP3 files are allowed'));
        }
    }
});


const PASSWORD = 'cw_music_2026';
const AUTH_TOKEN = 'cw_simple_token_123';

app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === PASSWORD) {
        res.json({ ok: true, token: AUTH_TOKEN });
    } else {
        res.status(401).json({ error: 'Invalid password' });
    }
});

app.get('/api/download/:filename', (req, res) => {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(UPLOAD_DIR, filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }
    res.download(filePath);
});


app.get('/api/music', (req, res) => {
    if (!fs.existsSync(METADATA_FILE)) {
        return res.json([]);
    }
    const data = fs.readFileSync(METADATA_FILE, 'utf8');
    res.json(JSON.parse(data));
});


app.post('/api/upload-music', upload.single('music'), (req, res) => {
    const { ign } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const musicData = {
        id: Date.now(),
        ign: ign || 'Unknown',
        filename: req.file.filename,
        originalName: req.file.originalname,
        uploadDate: new Date().toISOString(),
        url: `/music/${req.file.filename}`
    };

    let metadata = [];
    if (fs.existsSync(METADATA_FILE)) {
        metadata = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf8'));
    }
    metadata.unshift(musicData);
    fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));

    res.json({ ok: true, data: musicData });
});


app.post('/api/delete-all', (req, res) => {
    const { password } = req.body;
    if (password !== PASSWORD) {
        return res.status(401).json({ error: 'Invalid access code' });
    }

    try {
        
        if (fs.existsSync(METADATA_FILE)) {
            fs.writeFileSync(METADATA_FILE, JSON.stringify([]));
        }

        
        if (fs.existsSync(UPLOAD_DIR)) {
            const files = fs.readdirSync(UPLOAD_DIR);
            for (const file of files) {
                fs.unlinkSync(path.join(UPLOAD_DIR, file));
            }
        }

        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete files' });
    }
});

app.listen(PORT, () => {
    console.log(`Killcam Music Server running on http://localhost:${PORT}`);
});
