import PropTypes from "prop-types";
import BlogItem from "./BlogItem";
import { useState, useEffect } from "react";
import { BsList, BsGrid3X3 } from "react-icons/bs"; 

const BlogList = ({ blogs, setBlogs, layout }) => {
  const storedLayout = localStorage.getItem("layout") || layout || "grid";
  const [currentLayout, setCurrentLayout] = useState(storedLayout);

  useEffect(() => {
    localStorage.setItem("layout", currentLayout);
  }, [currentLayout]);

  const handleLayoutToggle = () => {
    setCurrentLayout((prevLayout) => (prevLayout === "grid" ? "list" : "grid"));
  };

  return (
    <div>
      <div
        onClick={handleLayoutToggle}
        className="flex items-center cursor-pointer bg-white border border-gray-600 rounded-full w-fit mt-5 mb-5"
      >
        <div
          className={`flex justify-center items-center bg-blue-400 rounded-l-3xl w-12 h-10 transition-all duration-300 ${currentLayout === "list" ? "bg-blue-400" : "bg-transparent"
            }`}
        >
          <BsList className="text-black" />
        </div>

        <div className="bg-gray-500 w-0.5 h-10 rounded-full "></div>

        <div
          className={`flex justify-center items-center bg-blue-400 rounded-r-3xl w-12 h-10 transition-all duration-300 ${currentLayout === "grid" ? "bg-blue-400" : "bg-transparent"
            }`}
        >
          <BsGrid3X3 className="text-black" />
        </div>
      </div>

      <div
        className={`${currentLayout === "grid"
          ? "grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-4"
          : "flex flex-col gap-4"
          } px-10 mt-15 text-black`}
      >
        {blogs.map((blog) => (
          <BlogItem key={blog._id} blog={blog} setBlogs={setBlogs} />
        ))}
      </div>
    </div>
  );
};

BlogList.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string,
      imageCloudUrl: PropTypes.string,
      likes: PropTypes.number,
      isLiked: PropTypes.bool,
      isSaved: PropTypes.bool,
    })
  ).isRequired,
  setBlogs: PropTypes.func.isRequired,
  layout: PropTypes.oneOf(["grid", "list"]), 
};

export default BlogList;
