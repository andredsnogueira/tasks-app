const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authRepository = require('../repositories/authRepository');

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors });
    }

    const user = await authRepository.login(req);

    if (!user) {
      return res
        .status(404)
        .json({ error: 'There is no user associated with that email.' });
    } else {
      bcrypt.compare(req.body.password, user.password, (err, same) => {
        if (err) {
          return res.status(500).json({ error: err });
        } else if (same) {
          return res.json({
            token: jwt.sign(
              {
                data: {
                  id: user.id,
                  email: user.email,
                  manager: user.manager,
                },
              },
              process.env.APP_SECRET
            ),
          });
        }
        return res
          .status(401)
          .json({ error: "The credentials doesn't match." });
      });
    }
  } catch (_) {
    return res.status(500).json();
  }
};
