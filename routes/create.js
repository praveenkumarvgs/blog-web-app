import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
//import posts from './public/data/posts.json' assert { type: "json" };
//import posts from "../data/posts.json" with { type: "json" };

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const postsFilePath = path.join(__dirname, '..', 'public', 'data', 'posts.json');

router.post('/create', express.urlencoded({ extended: true }), (req, res) => {
    const { title, author, date, thumbnail, background_image, summary, content, category, tags } = req.body;

    // Read posts fresh from file each time
    let posts;
    try {
        const data = fs.readFileSync(postsFilePath, 'utf-8');
        posts = JSON.parse(data);
    } catch (err) {
        console.error('Error reading posts file:', err);
        return res.status(500).send('Failed to read posts');
    }


    // Validation: Check for duplicates
    if (posts.some(post => post.title.trim().toLowerCase() === title.trim().toLowerCase())) {
        return res.status(400).send('Duplicate post title not allowed');
    }

    if (!title || !author || !content) {
        return res.status(400).json({ error: 'Title, author, and content are required' });
    }

    // Generate unique ID
    const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;

    //const summary = content.length > 60 ? content.slice(0, 60) + '...' : content;

    const newPost = {
        id: newId,
        title,
        author,
        date,
        thumbnail,
        background_image,
        summary,
        content,
        category,
        tags
    };

    // Add post and write back to file
    posts.push(newPost);
    fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), err => {
        if (err) {
            console.error('Error writing posts file:', err);
            return res.status(500).send('Failed to save post');
        }
        res.redirect('/blog'); // or send a success message
    });
});

export default router;
