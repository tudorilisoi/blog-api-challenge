const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');


BlogPosts.create(
    'first blog', 'Hello, this is my very first blog.', 'SS', '1/10/2019'
);

BlogPosts.create(
    'second blog', 'Hello, this is my second blog.', 'SS', '1/10/2019'
);

BlogPosts.create(
    'third blog', 'Hello, this is my third blog.', 'SS', '1/10/2019'
);

router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for(let i=0; i<requiredFields.length; i++)
    {
        const field = requiredFields[i];
        if(!(field in req.body))
        {
            const message = `Missing required field \`{field}\` in request body.`
            console.error(message);
            return res.status(400).send(message);
        }        
    }
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log('Deleted blog post');
    res.status(204).end();
});

router.put('/:id', jsonParser, (req, res)=> {
    //validate and see that all the required fields are in the reqest body
    const requiredFields = ["id", "title", "content", "author", "publishDate"];
    for(let i=0; i<requiredFields.length; i++)
    {
        const field = requiredFields[i];
        if(!(field in req.body))
        {
            const message = `Missing required field \`${field}\` in request body.`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    //validate that the id in the request path and the id in the request body match
    if(req.params.id !== req.body.id)
    {
        const message = `Request path id ${req.params.id} and 
           request body id ${req.body.id} must match.`;
        console.error(message);
        return res.status(400).send(message);        
    }

    //update the blog post
    console.log(`Updating blog post ${req.params.id}`);
    const updatedItem = BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        date: req.body.date
    });
    res.status(204).end();
});

module.exports = router;