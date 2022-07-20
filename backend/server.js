import express from 'express';
import data from './data.js';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import bodyParser from 'body-parser';
const app = express();

dotenv.config();
app.use(cors());
app.use(morgan('dev'));

//mongodb connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then((data) => {
    console.log(`mongodb is connected at ${data.connection.host}`);
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/api/products', function (req, res) {
  res.send(data.products);
});
app.get('/api/products/slug/:slug', (req, res) => {
  const product = data.products.find((x) => x.slug === req.params.slug);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product not found' });
  }
});
app.get('/api/products/:id', (req, res) => {
  const product = data.products.find((x) => x._id === req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product not found' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log(`server at http://localhost:${port}`);
});
