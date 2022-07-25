import express from 'express';
import data from './data.js';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/produtRoutes.js';
import authRoute from './routes/auth.js';
import orderRoute from './routes/orderRoutes.js';
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

app.use('/api/seed', seedRouter);

app.use('/api/products', productRouter);
app.use('/api/user/', authRoute);
app.use('/api/orders', orderRoute);
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`server at http://localhost:${port}`);
});
