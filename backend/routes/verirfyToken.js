import jwt from 'jsonwebtoken';
import user from "../models/userModel.js";

// export const isAuth =(req, res, next) => {
//   const authorization=req.headers.authorization;
//   if(authorization){
//     const token =authorization.split(" ")[1];
//     jwt.verify(token, "mysecretkey", (err, decode)=>{
//       if(err){
//         res.status(401).send({message:"Invalid Token"})
//       }else{
//         req.user=decode;
//         next();
//       }
//     })
//   }
//    else{
//     res.status(401).send({messsage:"No Token"})
//   }
// }
export const verifyToken = (req, res, next) => {
   try {
    const token = req.headers.authorization.split(' ')[1];
    const data = jwt.verify(token, 'mysecretkey');

    user
      .findOne({ _id: data.userId })
      .then(function (result) {
        console.log(result);
        req.userInfo = result;
        next();
      })
      .catch(function (e) {
        res.json({ err: e });
      });
  } catch (e) {
    res.send({ msg: 'Invalid token' });
  }

  // const authHeader = req.headers.token;
  // if (authHeader) {
  //   const token = authHeader.split(' ') [1];
  //   jwt.verify(token, 'mysecretkey', (err, decode) => {
  //     if (err){
  //        res.status(401).json('token is not valid');
  //     }
  //     else{
  //       req.user = decode;
  //        next();
  //     }
      
  //   });
  // }
  // else{
  //   res.status(401).send({messsage:"No Token"})
  // }
};

export const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json('you are not allowed access');
    }
  });
};
export const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res
        .status(403)
        .json('you are accessed, only admin has access to do this');
    }
  });
};
