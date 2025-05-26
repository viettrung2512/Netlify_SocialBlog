const HistoryService = require("../services/historyService");

class HistoryController {
  async getHistory(req, res) {
    try {
      const userId = req.user.userId; // Sửa từ req.user.id sang req.user.userId
      const { page = 1, limit = 10 } = req.query;
      const result = await HistoryService.getUserHistory(
        userId, 
        parseInt(page), 
        parseInt(limit)
      );
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  
  async addHistory(req, res) {
    try {
      const userId = req.user.id;
      const { action, details } = req.body;
      if (!["view_post", "create_post", "comment", "like"].includes(action)) {
        return res.status(400).json({
          success: false,
          message: "Invalid action type",
        });
      }
      const historyEntry = await HistoryService.addHistory(
        userId,
        action,
        details
      );
      res.status(201).json({
        success: true,
        data: historyEntry,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new HistoryController();
