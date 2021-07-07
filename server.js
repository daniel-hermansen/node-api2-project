const express = require('express');
const server = express();
const postRouter = require('./posts/postRouter');

server.use(express.json());
server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
    const { name = '' } = req.query;
    res.send(`
      <h2>Blog API</h>
      <p>Welcome ${name+" "}to the Blog API</p>
    `);
  });


  module.exports = server;