const Follow = require('../models/Follow');
const User = require('../models/User');
const mongoose = require('mongoose');

module.exports = {

  // Follow a user
  async followUser(currentUserId, targetUserId) {
    try {
      // Kiểm tra nếu người dùng muốn follow chính họ
      if (currentUserId === targetUserId) {
        throw new Error("You can't follow yourself");
      }

      // Kiểm tra nếu mối quan hệ follow đã tồn tại
      const existingFollow = await Follow.findOne({ follower: currentUserId, following: targetUserId });
      if (existingFollow) {
        throw new Error("You are already following this user");
      }

      // Tạo mới mối quan hệ follow
      const follow = new Follow({
        follower: currentUserId,
        following: targetUserId,
        followedAt: Date.now()
      });

      await follow.save();

      // Cập nhật danh sách following và followers cho 2 người dùng
      await User.updateOne(
        { _id: currentUserId },
        { $push: { following: follow._id } }
      );

      await User.updateOne(
        { _id: targetUserId },
        { $push: { followers: follow._id } }
      );

      return follow;
    } catch (err) {
      throw err;
    }
  },

  // Unfollow a user
  async unfollowUser(currentUserId, targetUserId) {
    try {
      // Kiểm tra mối quan hệ follow tồn tại hay không
      const follow = await Follow.findOneAndDelete({ follower: currentUserId, following: targetUserId });
      if (!follow) {
        throw new Error("Follow relationship does not exist");
      }

      // Cập nhật lại danh sách following và followers
      await User.updateOne(
        { _id: currentUserId },
        { $pull: { following: follow._id } }
      );

      await User.updateOne(
        { _id: targetUserId },
        { $pull: { followers: follow._id } }
      );

      return follow;
    } catch (err) {
      throw err;
    }
  },

  // Get followers of a user
  async getFollowers(userId) {
    try {
      const user = await User.findById(userId).populate({
        path: 'followers',
        populate: {
          path: 'follower',
          model: 'User',
          select: '_id name username profilePicture',
        },
      }).lean();
      if (!user) throw new Error('User not found');
      return user.followers
        .filter(follow => follow.follower !== null)
        .map(follow => ({
          id: follow.follower._id,
          name: follow.follower.name,
          username: follow.follower.username,
          profilePicture: follow.follower.profilePicture,
        }));
    } catch (err) {
      throw err;
    }
  },

  // Get following of a user
  async getFollowing(userId) {
    try {
      const user = await User.findById(userId).populate({
        path: 'following',
        populate: {
          path: 'following',
          model: 'User',
          select: '_id name username profilePicture',
        },
      });
      if (!user) throw new Error('User not found');
      return user.following.map(follow => ({
        id: follow.following._id,
        name: follow.following.name,
        username: follow.following.username,
        profilePicture: follow.following.profilePicture,
      }));
    } catch (err) {
      throw err;
    }
  },

  // Get my followers (current logged-in user)
  async getMyFollowers(currentUserId) {
    try {
      const user = await User.findById(currentUserId).populate('followers');
      return user.followers;
    } catch (err) {
      throw err;
    }
  },

  // Get my following (current logged-in user)
  async getMyFollowing(currentUserId) {
    try {
      const user = await User.findById(currentUserId).populate('following');
      return user.following;
    } catch (err) {
      throw err;
    }
  }
};
