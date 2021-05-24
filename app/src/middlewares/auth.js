const jwt = require('jsonwebtoken');

exports.verify = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(404).json({ error: 'Token not found.' });
  }
  jwt.verify(token.split(' ')[1], process.env.APP_SECRET, (err, value) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    req.user = value.data;
    next();
  });
};
