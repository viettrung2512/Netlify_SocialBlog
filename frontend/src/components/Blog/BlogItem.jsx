import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import SaveButton from "../Button/SaveButton";
import LikeButton from "../Button/LikeButton";
import { useState } from "react";
import { useEffect } from "react";

const BlogItem = ({ blog, setBlogs }) => {
  const navigate = useNavigate();

  const [likes, setLikes] = useState(blog.likeCnt || 0);
  const [isLiked, setIsLiked] = useState(blog.liked ?? false);
  const [isSaved, setIsSaved] = useState(blog.saved ?? false);

  useEffect(() => {
    setIsLiked(blog.liked);
    setIsSaved(blog.saved);
    setLikes(blog.likeCnt);
  }, [blog.liked, blog.saved, blog.likeCnt]);

  const handleNavigate = () => {
    navigate(`/blog/${blog._id}`);
  };

  return (
    <div className="block cursor-pointer" onClick={handleNavigate}>
      <div className="relative flex items-center border border-gray-100 bg-white rounded-lg hover:shadow-xl hover:scale-[1.02] transition transform duration-300 h-36 overflow-hidden">
        <div className="flex-shrink-0 w-1/4 h-36">
          <img
            className="w-full h-full object-cover rounded-l-lg"
            src={blog.imageCloudUrl}
            onError={(e) => {
              e.target.src =
                import.meta.env.VITE_API_BASE_URL + "/default-blog-image.png";
            }}
          />
        </div>

        <div className="flex-1 p-4 flex flex-col justify-between">
          <div
            className="absolute top-2 right-5"
            onClick={(e) => e.stopPropagation()}
          >
            <SaveButton
              blog={blog}
              blogId={blog._id}
              setBlogs={setBlogs}
              isSaved={isSaved}
              setIsSaved={setIsSaved}
            />
          </div>
          <div
            className="absolute bottom-2 right-2"
            onClick={(e) => e.stopPropagation()}
          >
            <LikeButton
              blogId={blog._id}
              likes={likes}
              isLiked={isLiked}
              setLikes={setLikes}
              setIsLiked={setIsLiked}
              setBlogs={setBlogs}
            />
          </div>

          <span className="text-xl font-medium text-gray-500 block mb-2">
            {blog.category}
          </span>

          <h3 className="text-2xl font-semibold text-black truncate overflow-hidden whitespace-nowrap">
            {blog.title}
          </h3>

          <div className="flex items-center space-x-3 pt-2">
            {blog.author ? (
              <>
                <img
                  className="w-6 h-6 rounded-full object-cover"
                  src={blog.author.profilePicture}
                  alt="Author"
                />
                <h1 className="text-xs font-medium text-black">
                  {blog.author.name}
                </h1>
              </>
            ) : (
              <>
                <div className="w-6 h-6 rounded-full bg-gray-300 inline-block"></div>
                <h1 className="text-xs font-medium text-black">Unknown</h1>
              </>
            )}
            <span className="text-xs text-gray-500">
              {blog.createdAt
                ? new Date(blog.createdAt).toLocaleDateString("en-GB")
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

BlogItem.propTypes = {
  blog: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    category: PropTypes.string,
    imageCloudUrl: PropTypes.string,
    likeCnt: PropTypes.number,
    liked: PropTypes.boolean,
    saved: PropTypes.boolean,
    author: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      profilePicture: PropTypes.string,
      username: PropTypes.string,
    }),
  }).isRequired,
  setBlogs: PropTypes.func,
};

export default BlogItem;
