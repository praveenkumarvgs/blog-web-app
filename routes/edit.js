import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const postsFilePath = path.join(__dirname, '..', 'public', 'data', 'posts.json');

router.get('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    fs.readFile(postsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error reading posts');
        }

        let posts = JSON.parse(data);
        const post = posts.find(p => p.id === postId);

        if (!post) return res.status(404).send('Post not found');

        res.render('edit', { post });
    });
});

router.post('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const { title, author, content } = req.body;

    fs.readFile(postsFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading posts');

        let posts = JSON.parse(data);
        const index = posts.findIndex(p => p.id === postId);

        if (index === -1) return res.status(404).send('Post not found');

        // Update the post
        posts[index].title = title;
        posts[index].author = author;
        posts[index].content = content;

        fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (err) => {
            if (err) return res.status(500).send('Error saving post');
            res.redirect('/blog');
        });
    });
});

export default router;
