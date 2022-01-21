const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const { default: axios } = require('axios');

const app = express();
app.use(express.json());
app.use(cors());
const posts = {};
app.get('/posts', (req, res) => {
  res.send(posts);
});
app.post('/posts', async (req, res) => {
  const { title } = req.body;
  const id = randomBytes(4).toString('hex');
  posts[id] = {
    id,
    title,
  };
  await axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: {
      id,
      title,
    },
  });
  res.status(201).json(posts[id]);
});

app.post('/events', (req, res) => {
  console.log(req.body.type);
  res.send('getting the event bus through here. ');
});
app.listen(4000, () => {
  console.log(`Post service is running on port 4000`);
});
