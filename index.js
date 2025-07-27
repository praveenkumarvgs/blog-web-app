import bodyParser from "body-parser";
import express from "express";
import expressLayouts from "express-ejs-layouts";
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import blogRoutes from './routes/blog.js';
import createRoute from './routes/create.js';
import deleteRoute from './routes/delete.js';
import editRoute from './routes/edit.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const postsFilePath = path.join(__dirname, 'public', 'data', 'posts.json');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(expressLayouts);

app.set('layout', 'layout'); // layout.ejs
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index", { title: "Home" }); // this renders views/index.ejs
});

app.use('/', blogRoutes);

app.get('/single/:id', (req, res) => {
    const posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf-8'));
    const post = posts.find(p => p.id == req.params.id);
    if (!post) {
        return res.status(404).send('Post not found');
    }
    res.render('single', { post });
});


app.get("/about", (req, res) => {
    res.render("about", { title: "About" });
});

app.get("/contact", (req, res) => {
    res.render("contact", { title: "Contact" });
});

app.post("/submit", (req, res) => {
    const name = req.body["first-name"];
    res.render("reply", { firstName: name, title: "Message" });
});

app.post("/subscribe", (req, res) => {
    res.render("reply", { title: "Subscribe" });
});

app.use('/', createRoute);

app.use('/', deleteRoute);

app.use('/', editRoute);

app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}`);
});
