const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'placeholder_secret_change_me_in_production', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
