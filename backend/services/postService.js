const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const Bookmark = require("../models/Bookmark");
const Follow = require("../models/Follow");
const NotificationService = require("./notificationService");
const { LIKE_TYPE } = require("../constants");
const mongoose = require("mongoose");
const { DBRef } = require("bson");

module.exports = {
  async sendNewPostNotificationToUsers(followers, postId, currUsername) {
    if (followers.length === 0) {
      return;
    }
    for (const followerRecord of followers) {
      const userId = followerRecord.follower;
      if (userId) {
        try {
          await NotificationService.createNewPostNotification(
            userId,
            postId,
            "🆕 Bài viết mới",
            `📢 ${currUsername} vừa đăng một bài viết mới!`
          );
        } catch (notificationError) {}
      } else {
      }
    }
  },

  async getAllPosts(page, size, sort = "createdAt,desc", userId = null) {
    const [sortField, sortDir] = sort.split(",");
    const sortOption = { [sortField]: sortDir === "desc" ? -1 : 1 };

    let query = Post.find({})
      .sort(sortOption)
      .populate("author", "name profilePicture username")
      .lean();

    if (page !== undefined && size !== undefined) {
      const skip = parseInt(page) * parseInt(size);
      const limit = parseInt(size);
      if (!isNaN(skip) && !isNaN(limit)) {
        query = query.skip(skip).limit(limit);
      } else {
      }
    }

    const posts = await query.exec();
    const postIds = posts.map((post) => post._id);

    if (postIds.length === 0) {
      return [];
    }

    const [likeCounts, saveCounts] = await Promise.all([
      Like.aggregate([
        { $match: { contentId: { $in: postIds }, type: LIKE_TYPE.POST } },
        { $group: { _id: "$contentId", count: { $sum: 1 } } },
      ]),
      Bookmark.aggregate([
        { $match: { postId: { $in: postIds } } },
        { $group: { _id: "$postId", count: { $sum: 1 } } },
      ]),
    ]);

    const likeCountMap = likeCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    const saveCountMap = saveCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    let likedIds = new Set();
    let savedIds = new Set();

    if (userId) {
      try {
        const userIdObj = new mongoose.Types.ObjectId(userId);
        const [userLikes, userSaves] = await Promise.all([
          Like.find({
            userId: userIdObj,
            contentId: { $in: postIds },
            type: "POST",
          }).lean(),
          Bookmark.find({
            userId: userIdObj,
            postId: { $in: postIds },
          }).lean(),
        ]);
        likedIds = new Set(userLikes.map((like) => like.contentId.toString()));
        savedIds = new Set(userSaves.map((save) => save.postId.toString()));
      } catch (error) {}
    }

    const results = posts.map((post) => {
      const postIdString = post._id.toString();
      const authorDetails = post.author
        ? {
            id: post.author._id ? post.author._id.toString() : undefined,
            name: post.author.name,
            username: post.author.username,
            profilePicture: post.author.profilePicture, 
          }
        : null;

      return {
        id: postIdString,
        _id: post._id,
        title: post.title,
        category: post.category,
        content: post.content,
        imageCloudUrl: post.imageCloudUrl,
        createdAt: post.createdAt,
        author: authorDetails,
        likeCnt: likeCountMap[postIdString] || 0,
        saveCnt: saveCountMap[postIdString] || 0,
        liked: userId ? likedIds.has(postIdString) : false,
        saved: userId ? savedIds.has(postIdString) : false,
      };
    });

    return results;
  },

async getPostById(id) {
  const post = await Post.findById(id);
  if (!post) throw new Error("Post not found"); // Kiểm tra ngay từ đầu

  // Cách lấy userId an toàn hơn
  const userId = post.author instanceof mongoose.Types.ObjectId 
    ? post.author 
    : post.author?._id || post.author?._doc?._id;

  if (userId) {
    const user = await User.findById(userId);
    post.author = user;
  }
  
  return post;
},

  async createPost(postRequest, req) {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate("followers").lean();
    if (!user) {
      throw new Error("Author user not found");
    }

    const { title, category, content, imageCloudUrl, tags = [] } = postRequest;

    const newPost = new Post({
      title,
      category,
      tags,
      content,
      imageCloudUrl: imageCloudUrl || "https://res.cloudinary.com/.../default-image.jpg",
      author: user._id,
      createdAt: new Date(),
    });

    const savedPost = await newPost.save();

    try {
      await module.exports.sendNewPostNotificationToUsers(
        user.followers,
        savedPost._id,
        user.username
      );
    } catch (notificationError) {}

    const postWithAuthor = await Post.findById(savedPost._id)
      .populate("author", "name profilePicture username")
      .lean();

    const result = {
      id: postWithAuthor._id.toString(),
      _id: postWithAuthor._id,
      title: postWithAuthor.title,
      category: postWithAuthor.category,
      content: postWithAuthor.content,
      imageCloudUrl: postWithAuthor.imageCloudUrl,
      createdAt: postWithAuthor.createdAt,
      author: postWithAuthor.author
        ? {
            id: postWithAuthor.author._id
              ? postWithAuthor.author._id.toString()
              : undefined,
            name: postWithAuthor.author.name,
            username: postWithAuthor.author.username,
            profilePicture: postWithAuthor.author.profilePicture,
          }
        : null,
      likeCnt: 0,
      saveCnt: 0,
      liked: false,
      saved: false,
    };

    return result;
  },

  async updatePost(id, postRequest) {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        ...postRequest,
        updatedAt: new Date(),
      },
      { new: true }
    )
      .populate("author", "name profilePicture username")
      .lean();

    if (!updatedPost) {
      throw new Error("Post not found");
    }
    return updatedPost;
  },

  async deletePost(id) {
    const post = await Post.findById(id).lean();
    if (!post) throw new Error("Post not found");

    await Comment.deleteMany({ postId: id });
    await Like.deleteMany({ contentId: id, type: LIKE_TYPE.POST });
    await Bookmark.deleteMany({ postId: id });

    await Post.findByIdAndDelete(id);
  },

  async deletePostR(id) {
    const post = await Post.findById(id).lean();
    if (!post) throw new Error("Post not found");
    const userId = post.author.toString();

    await Comment.deleteMany({ postId: id });
    await Like.deleteMany({ contentId: id, type: LIKE_TYPE.POST });
    await Bookmark.deleteMany({ postId: id });

    await Post.findByIdAndDelete(id);

    return userId;
  },

  async deleteNullComment(postId) {
    const post = await Post.findById(postId).populate("comments").lean();
    if (!post) {
      return;
    }

    const commentIdsToDelete = post.comments
      .filter((c) => c === null || c.content === null)
      .map((c) => c && c._id)
      .filter((id) => id !== undefined);

    if (commentIdsToDelete.length > 0) {
      await Comment.deleteMany({ _id: { $in: commentIdsToDelete } });

      const postToUpdate = await Post.findById(postId);
      if (postToUpdate) {
        postToUpdate.comments = postToUpdate.comments.filter(
          (commentId) =>
            !commentIdsToDelete.some((idToDelete) =>
              idToDelete.equals(commentId)
            )
        );
        await postToUpdate.save();
      }
    } else {
    }
  },

  async getMyPosts(targetUserId, currUserId = null) {
    const targetUserIdObj = new mongoose.Types.ObjectId(targetUserId);

    const posts = await Post.find({ author: targetUserIdObj })
      .populate("author", "name profilePicture username")
      .sort({ createdAt: -1 })
      .lean();

    const postIds = posts.map((post) => post._id);

    if (postIds.length === 0) {
      return [];
    }

    const [likeCounts, saveCounts, userLikes, userSaves] = await Promise.all([
      Like.aggregate([
        { $match: { contentId: { $in: postIds }, type: LIKE_TYPE.POST } },
        { $group: { _id: "$contentId", count: { $sum: 1 } } },
      ]),
      Bookmark.aggregate([
        { $match: { postId: { $in: postIds } } },
        { $group: { _id: "$postId", count: { $sum: 1 } } },
      ]),
      currUserId
        ? Like.find({
            userId: new mongoose.Types.ObjectId(currUserId),
            contentId: { $in: postIds },
            type: LIKE_TYPE.POST,
          }).lean()
        : Promise.resolve([]),
      currUserId
        ? Bookmark.find({
            userId: new mongoose.Types.ObjectId(currUserId),
            postId: { $in: postIds },
          }).lean()
        : Promise.resolve([]),
    ]);

    const likeCountMap = likeCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    const saveCountMap = saveCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    const likedIds = new Set(userLikes.map((l) => l.contentId.toString()));
    const savedIds = new Set(userSaves.map((s) => s.postId.toString()));

    const results = posts.map((post) => {
      const postIdString = post._id.toString();
      const authorDetails = post.author
        ? {
            id: post.author._id ? post.author._id.toString() : undefined,
            name: post.author.name,
            username: post.author.username,
            profilePicture: post.author.profilePicture,
          }
        : null;

      return {
        id: postIdString,
        _id: post._id,
        title: post.title,
        category: post.category,
        content: post.content,
        imageCloudUrl: post.imageCloudUrl,
        createdAt: post.createdAt,
        author: authorDetails,
        likeCnt: likeCountMap[postIdString] || 0,
        saveCnt: saveCountMap[postIdString] || 0,
        liked: likedIds.has(postIdString),
        saved: savedIds.has(postIdString),
      };
    });

    return results;
  },

  async getPostsByUser(targetUserId, currUserId = null) {
    return this.getMyPosts(targetUserId, currUserId);
  },

  async searchPosts(keyword, tags, userId = null) {
    let queryFilter = {};
    if (keyword && tags?.length) {
      queryFilter = {
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { tags: { $in: tags } },
        ],
      };
    } else if (keyword) {
      queryFilter = { title: { $regex: keyword, $options: "i" } };
    } else if (tags?.length) {
      queryFilter = { tags: { $in: tags } };
    } else {
      queryFilter = {};
    }

    const posts = await Post.find(queryFilter)
      .populate("author", "name profilePicture username")
      .sort({ createdAt: -1 })
      .lean();

    const postIds = posts.map((post) => post._id);

    if (postIds.length === 0) {
      return [];
    }

    const [likeCounts, saveCounts, userLikes, userSaves] = await Promise.all([
      Like.aggregate([
        { $match: { contentId: { $in: postIds }, type: LIKE_TYPE.POST } },
        { $group: { _id: "$contentId", count: { $sum: 1 } } },
      ]),
      Bookmark.aggregate([
        { $match: { postId: { $in: postIds } } },
        { $group: { _id: "$postId", count: { $sum: 1 } } },
      ]),
      userId
        ? Like.find({
            userId: new mongoose.Types.ObjectId(userId),
            contentId: { $in: postIds },
            type: LIKE_TYPE.POST,
          }).lean()
        : Promise.resolve([]),
      userId
        ? Bookmark.find({
            userId: new mongoose.Types.ObjectId(userId),
            postId: { $in: postIds },
          }).lean()
        : Promise.resolve([]),
    ]);

    const likeCountMap = likeCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    const saveCountMap = saveCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    const likedIds = new Set(userLikes.map((l) => l.contentId.toString()));
    const savedIds = new Set(userSaves.map((s) => s.postId.toString()));

    const results = posts.map((post) => {
      const postIdString = post._id.toString();
      const authorDetails = post.author
        ? {
            id: post.author._id ? post.author._id.toString() : undefined,
            name: post.author.name,
            username: post.author.username,
            profilePicture: post.author.profilePicture,
          }
        : null;

      return {
        id: postIdString,
        _id: post._id,
        title: post.title,
        category: post.category,
        content: post.content,
        imageCloudUrl: post.imageCloudUrl,
        createdAt: post.createdAt,
        author: authorDetails,
        likeCnt: likeCountMap[postIdString] || 0,
        saveCnt: saveCountMap[postIdString] || 0,
        liked: likedIds.has(postIdString),
        saved: savedIds.has(postIdString),
      };
    });

    return results;
  },

  async getPostsByMostLikes(userId = null) {
    const allLikes = await Like.find({ type: LIKE_TYPE.POST }).lean();

    const likeCountMap = allLikes.reduce((acc, like) => {
      const postId = like.contentId.toString();
      acc[postId] = (acc[postId] || 0) + 1;
      return acc;
    }, {});

    const allPosts = await Post.find({})
      .populate("author", "name profilePicture username")
      .lean();

    const postIds = allPosts.map((post) => post._id);

    if (postIds.length === 0) {
      return [];
    }

    const [saveCounts, userLikes, userSaves] = await Promise.all([
      Bookmark.aggregate([
        { $match: { postId: { $in: postIds } } },
        { $group: { _id: "$postId", count: { $sum: 1 } } },
      ]),
      userId
        ? Like.find({
            userId: new mongoose.Types.ObjectId(userId),
            contentId: { $in: postIds },
            type: LIKE_TYPE.POST,
          }).lean()
        : Promise.resolve([]),
      userId
        ? Bookmark.find({
            userId: new mongoose.Types.ObjectId(userId),
            postId: { $in: postIds },
          }).lean()
        : Promise.resolve([]),
    ]);

    const saveCountMap = saveCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    const likedIds = new Set(userLikes.map((l) => l.contentId.toString()));
    const savedIds = new Set(userSaves.map((s) => s.postId.toString()));

    const postsWithDetails = allPosts.map((post) => {
      const postIdString = post._id.toString();
      const authorDetails = post.author
        ? {
            id: post.author._id ? post.author._id.toString() : undefined,
            name: post.author.name,
            username: post.author.username,
            profilePicture: post.author.profilePicture,
          }
        : null;

      return {
        id: postIdString,
        _id: post._id,
        title: post.title,
        category: post.category,
        content: post.content,
        imageCloudUrl: post.imageCloudUrl,
        createdAt: post.createdAt,
        author: authorDetails,
        likeCnt: likeCountMap[postIdString] || 0,
        saveCnt: saveCountMap[postIdString] || 0,
        liked: likedIds.has(postIdString),
        saved: savedIds.has(postIdString),
      };
    });

    return postsWithDetails.sort((a, b) => b.likeCnt - a.likeCnt);
  },

  async getRelatedPosts(tag, postId, userId = null) {
    const posts = await Post.find({ tags: tag, _id: { $ne: postId } })
      .populate("author", "name profilePicture username")
      .lean();

    const postIds = posts.map((p) => p._id);

    if (postIds.length === 0) {
      return [];
    }

    const [likeCounts, saveCounts, userLikes, userSaves] = await Promise.all([
      Like.aggregate([
        { $match: { contentId: { $in: postIds }, type: LIKE_TYPE.POST } },
        { $group: { _id: "$contentId", count: { $sum: 1 } } },
      ]),
      Bookmark.aggregate([
        { $match: { postId: { $in: postIds } } },
        { $group: { _id: "$postId", count: { $sum: 1 } } },
      ]),
      userId
        ? Like.find({
            userId: new mongoose.Types.ObjectId(userId),
            contentId: { $in: postIds },
            type: LIKE_TYPE.POST,
          }).lean()
        : Promise.resolve([]),
      userId
        ? Bookmark.find({
            userId: new mongoose.Types.ObjectId(userId),
            postId: { $in: postIds },
          }).lean()
        : Promise.resolve([]),
    ]);

    const likeCountMap = likeCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    const saveCountMap = saveCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    const likedIds = new Set(userLikes.map((l) => l.contentId.toString()));
    const savedIds = new Set(userSaves.map((s) => s.postId.toString()));

    const results = posts.map((p) => {
      const postIdString = p._id.toString();
      const authorDetails = p.author
        ? {
            id: p.author._id ? p.author._id.toString() : undefined,
            name: p.author.name,
            username: p.author.username,
            profilePicture: p.author.profilePicture,
          }
        : null;

      return {
        id: postIdString,
        _id: p._id,
        title: p.title,
        category: p.category,
        content: p.content,
        imageCloudUrl: p.imageCloudUrl,
        createdAt: p.createdAt,
        author: authorDetails,
        likeCnt: likeCountMap[postIdString] || 0,
        saveCnt: saveCountMap[postIdString] || 0,
        liked: likedIds.has(postIdString),
        saved: savedIds.has(postIdString),
      };
    });

    return results;
  },

  async getPostByCommentId(commentId) {
    const comment = await Comment.findById(commentId).lean();
    if (!comment) {
      throw new Error("Comment not found");
    }
    if (!comment.postId) {
      throw new Error("Comment is not linked to a post");
    }

    return comment.postId.toString();
  },
};
