import express from 'express';
import Order from '../models/orderModel.js';
import {isAuth, verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization} from "./verirfyToken.js"

const orderRoute = express.Router();

orderRoute.post(
  '/',
  verifyToken,
  async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.userInfo._id,
    });
    const order = await newOrder.save();
    res
      .status(201)
      .send({ message: 'New order created', order });
  }
);
export default orderRoute;
