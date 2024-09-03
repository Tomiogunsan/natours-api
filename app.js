const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

// app.get('/', (req, res) => res.status(200).send('Hello World!'))
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
    console.log(req.body)
    res.send('Done')
})

const port = 3000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
