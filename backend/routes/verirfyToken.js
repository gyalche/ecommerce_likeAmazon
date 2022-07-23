import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'mysecretkey', (err, user) => {
      if (err) res.status(402).json('token is not valid');
      req.user = user;
      next();
    });
  }
};

export const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id == req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json('you are not allowed access');
    }
  });
};
export const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.use.isAdmin) {
      next();
    } else {
      res
        .status(403)
        .json('you are accessed, only admin has access to do this');
    }
  });
};
