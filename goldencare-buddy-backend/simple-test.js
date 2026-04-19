import express from 'express';

const app = express();
const PORT = 3002;

app.get('/', (req, res) => {
  res.json({ message: 'Simple test server running' });
});

app.listen(PORT, () => {
  console.log(`Simple test server running on port ${PORT}`);
});