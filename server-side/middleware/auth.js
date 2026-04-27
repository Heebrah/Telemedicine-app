const jwt = require('jsonwebtoken');
const SECRET = process.env.SESSION_SECRET || 'your_secret_key';

module.exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT ERROR:', err.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};