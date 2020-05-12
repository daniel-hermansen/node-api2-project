const express = require('express');
const Posts = require('../data/db');
const router = express.Router();

router.get('/', (req, res) => {
    Posts.find(req.query)
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ 
            errorMessage: "The posts could not be retrieved"
        });
    })
});

router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        if(post){
            res.status(200).json(post);
        } else {
            res.status(404).json({ 
                errorMessage: "The post with the specified ID does not exist."
            })
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            errorMessage: "The post information could not be retrieved"
        })
    })
});

router.get('/:id/comments', (req, res) => {
    Posts.findPostComments(req.params.id)
    .then(comments => {
        if(comments){
            res.status(200).json(comments)
        } else {
            res.status(404).json({
                errorMessage: "The post with the specified ID does not exist."
            })
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            errorMessage: "The comments information could not be retrieved."
        })
    })
})

router.post('/', (req, res) => {
    const newPost = Posts.insert({
        title: req.body.title,
        contents: req.body.contents,
    })
    .then(newPost => {
        if(newPost){
            res.status(201).json(newPost)
        } else {
            res.status(400).json({
                errorMessage: "Please provide title and contents for the post"
            })
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            errorMessage: "There was an error while saving the post to the database"
        })
    })
});

// router.post('/:id/comments', (req, res));

// router.delete();

// router.put();


module.exports = router;