const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const HistoryController = require('../controllers/historyController');
const UserHistory = require('../models/UserHistory'); // Import the UserHistory model

// Lấy lịch sử của người dùng
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId; // Lấy userId từ token
    console.log('Fetching history for User ID:', userId); // Log userId

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const history = await UserHistory.find({ userId })
      .populate('details.postId', 'title imageCloudUrl') // Populate thông tin bài viết
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await UserHistory.countDocuments({ userId });
    console.log('Fetched History:', history); // Log dữ liệu lịch sử

    res.status(200).json({
      success: true,
      data: {
        history,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching history:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching history' });
  }
});

// Route để thêm lịch sử
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.userId;

    // Luôn lưu mới mỗi lần xem, không kiểm tra 24h
    await UserHistory.create({
      userId,
      action: "view_post",
      details: { postId },
      timestamp: new Date(),
    });

    res.status(201).json({ success: true, message: 'History added successfully' });
  } catch (error) {
    console.error('Error adding history:', error.message);
    res.status(500).json({ success: false, message: 'Error adding history' });
  }
});

module.exports = router;
