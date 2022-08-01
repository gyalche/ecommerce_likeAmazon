import express from 'express';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs'
import {generateToken} from "../utils.js"
const router = new express.Router();


router.post('/register', async function (req, res) {
  
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(req.body.password, 'mysecretkey').toString(),
  });
  res.send({
    _id:user._id,
    username:user.username,
    email:user.email,
    isAdmin:user.isAdmin,
    token:generateToken(user)
  })

  // try {
  //   const savedUser = await user.save();
  //   res.status(201).send({ savedUser, success: true });
  // } catch (error) {
  //   res.status(500).send(error.message);
  // }
});

//Login;

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
    if(user) {
      
      if(bcrypt(req.body.password, user.password)){
        res.send({
          _id:user._id,
          username:user.username,
          email:user.email,
          isAdmin:user.isAdmin,
          token:generateToken(user)
        })
        return;
      }
    }
    res.status(401).send({message:"invalid email or password"})
    
  })
  
  //   !user && res.status(401).json('email doesnt exist');

  //   const hashedPassword = CryptoJS.AES.decrypt(user.password, 'mysecretkey');

  //   const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

  //   // const inputPassword = req.body.password;
  //   originalPassword !== req.body.password &&
  //     res.status(401).json('password is incorrect');

  //   //if email and password matches;

  //   const accessToken = jwt.sign(
  //     {
  //       _id: user._id,
  //       isAdmin: user.isAdmin,
  //     },
  //     'mysecretkey',
  //     { expiresIn: '3d' }
  //   );
  //   const { password, ...others } = user._doc;
  //   res.status(200).json({ token: accessToken, ...others });
  // } catch (error) {
  //   res.status(500).json(error.message);
  // }


export default router;
