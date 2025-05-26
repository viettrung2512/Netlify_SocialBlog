const mongoose = require('mongoose');
const UserHistory = require('../models/UserHistory');

class HistoryService {
  async getUserHistory(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const aggregationPipeline = [
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        { $sort: { timestamp: -1 } }, 
        {
          $group: {
            _id: "$details.postId", 
            doc: { $first: "$$ROOT" } 
          }
        },
        { $replaceRoot: { newRoot: "$doc" } }, 
        { $skip: skip },
        { $limit: parseInt(limit) }
      ];

      const history = await UserHistory.aggregate(aggregationPipeline);

      await UserHistory.populate(history, {
        path: 'details.postId',
        select: 'title imageCloudUrl'
      });

      const totalUnique = (await UserHistory.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        { $group: { _id: "$details.postId" } },
        { $count: "total" }
      ]))[0]?.total || 0;

      return {
        history,
        total: totalUnique,
        page,
        totalPages: Math.ceil(totalUnique / limit),
      };
    } catch (error) {
      throw new Error('Error fetching user history: ' + error.message);
    }
    
  }
}

module.exports = new HistoryService();