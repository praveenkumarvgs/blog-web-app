import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const postsFilePath = path.join(__dirname, '..', 'public', 'data', 'posts.json');

router.post('/delete/:id', (req, res) => {
    const postId = parseInt(req.params.id);

    fs.readFile(postsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading posts');
        }

        let posts = JSON.parse(data);
        const index = posts.findIndex(post => post.id === postId);

        if (index === -1) {
            return res.status(404).send('Post not found');
        }

        posts.splice(index, 1);

        fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error deleting post');
            }
            res.redirect('/blog');
        });
    });
});

export default router;
