const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  console.log('authMiddleware is called'); // Log để kiểm tra middleware có được gọi
  const authHeader = req.header('Authorization');
  console.log('Authorization Header:', authHeader); // Log header Authorization

  if (!authHeader) {
    console.log('Authorization header is missing');
    return res.status(401).json({ success: false, message: 'Authorization header is missing' });
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token || token.trim() === '') {
    console.log('Token is empty');
    return res.status(401).json({ success: false, message: 'Token is empty' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // Gắn thông tin user vào req.user
    const userId = req.user.userId; // Lấy userId từ token
    console.log('Decoded Token:', decoded); // Log thông tin token đã giải mã
    next();
  } catch (error) {
    console.log('Invalid token:', error.message); // Log lỗi token
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
