import express from 'express';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs'
import {generateToken, isAuth} from "../utils.js"
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
  
 //update userprofile information;
 router.put('/profile', isAuth, async(req, res)=>{
   const user=await User.findById(req.user._id);
   if(user){
     user.username=req.body.username || user.username;
     user.email=req.body.email || user.email;
     if(req.body.password){
       user.password=bcrypt.hashSync(req.body.password, 8);
     }

     const updatedUser= await user.save();
     res.send({
       _id:updatedUser._id,
       username:updatedUser.username,
       email:updatedUser.email,
       isAdmin:updatedUser.isAdmin,
       token:generateToken(updatedUser)
     })
   }else{
     res.status(404).send({message:"user not found"})
   }
 })


export default router;
