import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const BlogCard = ({ blog, category, title }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/blog/${blog._id}`);
  };

  return (
    <div
      onClick={handleNavigation}
      className="relative border border-gray-100 rounded-lg overflow-hidden w-72 m-2 hover:shadow-xl hover:scale-[1.02] transition transform duration-300 cursor-pointer"
    >
      {/* Avatar tác giả */}
      {blog.author?.profilePicture && (
        <div 
          className="absolute top-2 right-2 z-10"
          onClick={(e) => e.stopPropagation()} // Ngăn navigation khi click avatar
        >
          <img
            src={blog.author.profilePicture}
            alt={`${blog.author.username}'s avatar`}
            className="w-8 h-8 rounded-full border-2 border-white object-cover"
            onError={(e) => {
              e.target.src = '/default-avatar.png'; // Fallback avatar
            }}
          />
        </div>
      )}

      {/* Ảnh bài viết */}
      <div className="relative">
        <img 
          src={blog.imageCloudUrl} 
          alt={title} 
          className="w-full h-44 object-cover"
          onError={(e) => {
            e.target.src = '/default-blog-image.png'; // Fallback ảnh bài viết
          }}
        />
      </div>

      {/* Nội dung */}
      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className="inline-block px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
            {category}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {title}
        </h3>
        
        {/* Tên tác giả */}
        {blog.author?.username && (
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span>Bởi </span>
            <span className="ml-1 font-medium text-gray-700">
              {blog.author.username}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

BlogCard.propTypes = {
  blog: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    author: PropTypes.shape({
      username: PropTypes.string,
      profilePicture: PropTypes.string,
    }),
    imageCloudUrl: PropTypes.string.isRequired
  }).isRequired,
  category: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default BlogCard;