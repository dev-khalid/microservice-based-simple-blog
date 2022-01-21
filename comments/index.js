const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');
const app = express();
app.use(express.json());
app.use(cors());
const commentsById = {};
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsById[req.params.id] || []);
});
app.post('/posts/:id/comments', async (req, res) => {
  const { content } = req.body;
  const comments = commentsById[req.params.id] || [];

  const commentId = randomBytes(4).toString('hex');
  comments.push({ id: commentId, content });
  commentsById[req.params.id] = comments;
  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
    },
  });
  res.status(201).json(commentsById[req.params.id]);
});
app.post('/events', (req, res) => {
  console.log(req.body.type);
  res.send('getting the event bus through here. ');
});
app.listen(4001, () => {
  console.log(`Post service is running on port 4001`);
});
