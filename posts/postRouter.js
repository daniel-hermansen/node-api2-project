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
    const newPost = req.body;
    if(newPost.title && newPost.contents) {
        Posts.insert(newPost)
            .then(post => {
                res.status(201).json(post);
            })
            .catch(err => {
                err,
                res.status(500).json({
                    error: "There was error while saving the post to the database!"
                });
            });
    } else {
        res.status(400).json({
            error: "Please provide title and contents for the post!"
        });
    }
});


router.post('/:id/comments', (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const comment = { ...req.body, post_id: id };
    if (!text) {
        res
        .status(400)
        .json({ errorMessage: 'Please provide text for the comment.' });
    } else {
        Posts.findById(id)
        .then(post => {
            if (!post.length) {
            res.status(404).json({
                message: 'The post with the specified ID does not exist.'
            });
            } else {
            Posts.insertComment(comment)
                .then(comment => {
                res.status(201).json(comment);
                })
                .catch(error => {
                res.status(500).json({
                    error:
                    'There was an error while saving the comment to the database'
                });
                });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
    }
});

router.delete("/:id", (req, res) => {
    Posts.remove(req.params.id)
        .then(count => {
    if (count > 0) {
      res.status(200).json({ message: 'The post has been deleted' });
    } else {
      res.status(404).json({ message: 'The post with the specified ID does not exist.' });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      errorMessage: "The post could not be removed",
    });
  });
});

router.put('/:id', (req, res) => {
    const post = req.body;
    if (!post.title || !post.contents) {
        res.status(400).json({
          errorMessage: 'Please provide title and contents for the updated post.'
        });
    } else {
        Posts.update(req.params.id, post)
            .then(updated => {
                if (updated) {
                    res.status(200).json(updated);
                } else {
                    res.status(404).json({ 
                        errorMessage: 'The post with the specified ID does not exist.'
                    });
                }
            })
            .catch(error => {
        // log error to database
                console.log(error);
                res.status(500).json({
                    message: 'The post information could not be modified.',
                });
            });
    }
});


module.exports = router;