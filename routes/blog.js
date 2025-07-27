import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const postsFilePath = path.join(__dirname, '..', 'public', 'data', 'posts.json');

router.get('/blog', (req, res) => {
    fs.readFile(postsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error loading blog posts');
        }
        try {
            const posts = JSON.parse(data);
            res.render('blog', { title: 'Blog', posts });
        } catch {
            res.status(500).send('Invalid JSON format');
        }
    });
});

export default router;
