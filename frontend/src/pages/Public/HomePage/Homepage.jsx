import { useEffect, useState } from "react";
import NavBar from "../../../components/Header/NavBar";
import SideBar from "../../../components/Sidebar/SideBar";
import BlogList from "../../../components/Blog/BlogList";
import TopAuthors from "../../../components/Author/TopAuthors";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Thêm Framer Motion cho animation

const Homepage = () => {
  const [blogs, setBlogs] = useState([]);
  const [mostLikedBlogs, setMostLikedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage, setBlogsPerPage] = useState(6);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Logic fetchBlogs và fetchMostLikedBlogs giữ nguyên
  const fetchBlogs = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const headers = token
        ? {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        : {
            "Content-Type": "application/json",
          };
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: "GET",
        headers: headers,
      });
      if (response.ok) {
        const data = await response.json();
        const blogsData = Array.isArray(data) ? data : data.content || [];
        setBlogs(blogsData);
      } else {
        const errorData = await response.json();
        console.error("Lỗi khi lấy danh sách blog:", errorData.message);
        setBlogs([]);
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMostLikedBlogs = async () => {
    try {
      const mostLikedResponse = await fetch(
        `${API_BASE_URL}/api/posts/most-liked`
      );
      if (mostLikedResponse.ok) {
        const mostLikedData = await mostLikedResponse.json();
        const mostLikedBlogsData = Array.isArray(mostLikedData)
          ? mostLikedData
          : mostLikedData.content || [];
        setMostLikedBlogs(mostLikedBlogsData);
      } else {
        const errorData = await mostLikedResponse.json();
        console.error("Lỗi khi lấy bài blog được thích nhiều nhất:", errorData.message);
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchMostLikedBlogs();
  }, []);

  useEffect(() => {
    const loginSuccess = localStorage.getItem("loginSuccess");
    if (loginSuccess === "true") {
      setShowMessage(true);
      localStorage.removeItem("loginSuccess");
      const timer = setTimeout(() => setShowMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const newPostCreated = localStorage.getItem("newPostCreated");
    if (newPostCreated === "true") {
      fetchBlogs();
      fetchMostLikedBlogs();
      localStorage.removeItem("newPostCreated");
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, blogsPerPage]);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    if (!isNaN(newSize) && newSize > 0) {
      setBlogsPerPage(newSize);
    } else {
      console.warn("Invalid page size selected:", e.target.value);
    }
  };

  const scrollToAllBlogs = () => {
    const allBlogsSection = document.getElementById("all-blogs-section");
    if (allBlogsSection) {
      allBlogsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePageButtonClick = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      scrollToAllBlogs();
    } else {
      console.warn("Attempted to navigate to invalid page number:", pageNumber);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen text-gray-900 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-lg z-50">
        <NavBar
          setSearchTerm={setSearchTerm}
          resetPage={() => setCurrentPage(1)}
        />
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-800 w-64 transition-all duration-300 shadow-xl">
          <SideBar />
        </aside>

        {/* Main Content */}
        <div className="ml-64 flex-grow p-8">
          {/* Success Message */}
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed top-20 right-8 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50"
            >
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="font-medium">Login successfully!</p>
              </div>
            </motion.div>
          )}

          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-blue-700 to-indigo-900 rounded-3xl shadow-2xl mb-12 overflow-hidden relative"
          >
            <div className="max-w-7xl mx-auto px-8 py-20">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white leading-tight">
                Diverse Perspectives of the Young Generation
              </h1>
              <p className="text-xl md:text-2xl font-medium text-blue-100 mb-8">
                Write, Share, Connect, and Reflect at{" "}
                <span className="text-yellow-300 font-bold">CWTS</span>
              </p>
              <Link
                to="/create-post"
                className="inline-block bg-yellow-400 text-gray-900 font-semibold py-3 px-6 rounded-full hover:bg-yellow-500 transition duration-300"
              >
                Start Writing Now
              </Link>
            </div>
          </motion.section>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center my-16">
              <div className="relative">
                <div className="w-12 h-12 rounded-full animate-spin border-4 border-blue-500 border-t-transparent"></div>
              </div>
              <p className="ml-4 text-gray-600 text-lg font-medium">
                Loading blogs...
              </p>
            </div>
          ) : (
            <>
              {/* Popular Blogs */}
              <section className="mb-16">
                <div className="flex items-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800">
                    Popular Blogs
                  </h2>
                  <div className="ml-4 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 flex-grow rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mostLikedBlogs.slice(0, 6).map((blog) => (
                    <Link
                      to={`/blog/${blog._id}`}
                      key={blog._id}
                      className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300 overflow-hidden"
                    >
                      <div className="relative w-full h-48">
                        <img
                          src={blog.imageCloudUrl || "/placeholder.svg"}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          {blog.category}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-3">
                          {blog.title}
                        </h3>
                        <div className="flex items-center">
                          <img
                            className="w-8 h-8 rounded-full object-cover border-2 border-blue-400"
                            src={
                              blog.author?.profilePicture || "/placeholder.svg"
                            }
                            alt={blog.author?.name || "Unknown Author"}
                          />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">
                              {blog.author?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Banner Section */}
              <section className="my-12 relative overflow-hidden rounded-2xl shadow-lg">
                <img
                  src="/freepik-export-20241219071211VKAR.jpeg"
                  alt="Technology banner"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent flex items-center">
                  <div className="p-8 max-w-lg">
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Discover the Future of Technology
                    </h3>
                    <p className="text-blue-100 mb-6">
                      Stay ahead with the latest trends and innovations in tech.
                    </p>
                    <Link
                      to="/category/technology"
                      className="inline-block bg-white text-blue-700 font-semibold py-2 px-4 rounded-full hover:bg-blue-100 transition duration-300"
                    >
                      Explore Now
                    </Link>
                  </div>
                </div>
              </section>

              {/* Top Authors */}
              <section className="mb-16">
                <div className="flex items-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800">
                    Top Authors
                  </h2>
                  <div className="ml-4 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 flex-grow rounded-full"></div>
                </div>
                <TopAuthors />
              </section>

              {/* All Blogs */}
              <section id="all-blogs-section" className="mb-16">
                <div className="flex items-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800">
                    All Blogs
                  </h2>
                  <div className="ml-4 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 flex-grow rounded-full"></div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-medium">{currentBlogs.length}</span>{" "}
                    of{" "}
                    <span className="font-medium">{filteredBlogs.length}</span>{" "}
                    results
                    {filteredBlogs.length > 0 && totalPages > 0 && (
                      <>
                        {" "}
                        - Page{" "}
                        <span className="font-medium">{currentPage}</span> of{" "}
                        <span className="font-medium">{totalPages}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">
                      Items per page:
                    </span>
                    <select
                      value={blogsPerPage}
                      onChange={handlePageSizeChange}
                      className="border border-gray-300 rounded-lg px-3 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                    </select>
                  </div>
                </div>

                {currentBlogs.length > 0 ? (
                  <BlogList
                    blogs={currentBlogs}
                    setBlogs={setBlogs}
                    layout="grid"
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      {searchTerm
                        ? `No posts matching "${searchTerm}" were found.`
                        : "No blog posts available."}
                    </p>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex justify-center mt-10 space-x-2">
                    <button
                      onClick={() =>
                        handlePageButtonClick(Math.max(currentPage - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1 border-white border text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, idx) => (
                      <button
                        key={idx + 1}
                        onClick={() => handlePageButtonClick(idx + 1)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === idx + 1
                             ? "text-blue-500 border-white bg-white"
                            : "bg-white text-gray-700 border-white hover:bg-gray-100"
                        } transition duration-200`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        handlePageButtonClick(
                          Math.min(currentPage + 1, totalPages)
                        )
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border-white border text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;