const Like = require("../models/Like");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");

const likePost = async (postId, userId) => {
  // Kiểm tra xem bài viết đã có like từ người dùng này chưa
  const existingLike = await Like.findOne({
    userId,
    contentId: postId,
    type: "POST",
  });

  if (existingLike) {
    return; // Nếu like đã tồn tại, trả về false
  }

  // Tạo mới like
  const like = new Like({
    userId,
    contentId: postId,
    type: "POST",
  });
  await like.save();

  // Cập nhật bài viết với like mới
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      $push: { likes: like._id }, // Thêm like vào mảng likes
    },
    { new: true, runValidators: true } // Trả về bài viết đã cập nhật và kiểm tra validation
  ).populate("likes");

  if (!updatedPost) {
    throw new Error("Post not found");
  }
};

const unlikePost = async (postId, userId) => {
  const like = await Like.findOneAndDelete({
    userId,
    contentId: postId,
    type: "POST",
  });
  //   console.log(like);

  if (like) {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: like._id },
      },
      { new: true, runValidators: true } // Trả về bài viết đã cập nhật và kiểm tra validation
    );

    if (!updatedPost) {
      throw new Error("Post not found");
    }
  }
};

const likeComment = async (commentId, userId) => {
  const existingLike = await Like.findOne({
    userId,
    contentId: commentId,
    type: "COMMENT",
  });
  if (existingLike) return;

  const like = new Like({
    userId,
    contentId: commentId,
    type: "COMMENT",
  });
  await like.save();

  await Comment.findByIdAndUpdate(
    commentId,
    { $inc: { likeCount: 1 } },
    { new: true }
  );
};

const unlikeComment = async (commentId, userId) => {
  const like = await Like.findOneAndDelete({
    userId,
    contentId: commentId,
    type: "COMMENT",
  });
  if (like) {
    await Comment.findByIdAndUpdate(
      commentId,
      { $inc: { likeCount: -1 } },
      { new: true }
    );
  }
};

module.exports = { likePost, unlikePost, likeComment, unlikeComment };
