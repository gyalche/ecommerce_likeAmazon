import express from 'express';
const seedRouter = express.Router();
import Product from '../models/productModel.js';
import data from '../data.js';
seedRouter.get('/', async (req, res) => {
  await Product.remove({});
  const createProducts = await Product.insertMany(data.products);
  res.send({ createProducts });
});
export default seedRouter;
