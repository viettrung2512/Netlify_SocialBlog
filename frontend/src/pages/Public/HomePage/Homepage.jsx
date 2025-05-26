import { useEffect, useState } from "react";
import NavBar from "../../../components/Header/NavBar";
import SideBar from "../../../components/Sidebar/SideBar";
import BlogList from "../../../components/Blog/BlogList";
import TopAuthors from "../../../components/Author/TopAuthors";
import { Link } from "react-router-dom";

const Homepage = () => {
  const [blogs, setBlogs] = useState([]);
  const [mostLikedBlogs, setMostLikedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage, setBlogsPerPage] = useState(6);

  const getCurrentUserId = () => {
    return localStorage.getItem("userId");
  };

  const fetchBlogs = async () => {
    const token = localStorage.getItem("token");
    const userId = getCurrentUserId();
    setLoading(true);

    try {
      const response = await fetch(
        `/api/posts?userId=${userId}`, 
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
    const token = localStorage.getItem("token");
    const userId = getCurrentUserId();

    try {
      const mostLikedResponse = await fetch(
        `/api/posts/most-liked${userId ? `?userId=${userId}` : ''}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (mostLikedResponse.ok) {
        const mostLikedData = await mostLikedResponse.json();
        const mostLikedBlogsData = mostLikedData.content || [];
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
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <NavBar
          setSearchTerm={setSearchTerm}
          resetPage={() => {
            setCurrentPage(1);
          }}
        />
      </header>

      <div className="flex pt-16">
        <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-900 w-60 z-40 shadow-lg">
          <SideBar />
        </aside>

        <div className="ml-60 flex-grow p-6">
          {showMessage && (
            <div className="fixed top-20 right-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50 animate-fade-in-out">
              <div className="flex items-center">
                <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <p className="font-medium">Login successfully!</p>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-blue-600 to-indigo-800 rounded-2xl shadow-xl mb-10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-8 py-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
                Diverse Perspectives of the Young Generation in Vietnam
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-blue-100 mb-8">
                Write - Share - Connect - Reflect
                <br />
                All at <span className="text-yellow-300">CWTS</span>
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center my-16">
              <div className="relative">
                <div className="w-12 h-12 rounded-full absolute border-4 border-gray-200"></div>
                <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-blue-600 border-t-transparent"></div>
              </div>
              <p className="ml-4 text-gray-600 text-lg font-medium">Loading blogs...</p>
            </div>
          ) : (
            <>
              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">POPULAR BLOGS</h2>
                  <div className="ml-4 h-1 bg-blue-600 flex-grow rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {mostLikedBlogs.slice(0, 4).map((blog) => (
                    <Link
                      to={`/blog/${blog._id}`}
                      key={blog._id}
                      className="flex bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition transform duration-300"
                    >
                      <div className="flex-shrink-0 w-1/3">
                        <img
                          src={blog.imageCloudUrl || "/placeholder.svg"}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                          <span className="inline-block px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full mb-3">
                            {blog.category}
                          </span>
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2">{blog.title}</h3>
                        </div>
                        <div className="flex items-center mt-4">
                          <img
                            className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                            src={blog.author?.profilePicture || "/placeholder.svg"}
                            alt={blog.author?.name || "Unknown Author"}
                          />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{blog.author?.name || "Unknown"}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              <div className="my-12 flex justify-center">
                <div className="relative w-full max-w-5xl overflow-hidden rounded-xl shadow-lg">
                  <img
                    src="/freepik-export-20241219071211VKAR.jpeg"
                    alt="Technology banner"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-transparent flex items-center">
                    <div className="p-8 max-w-md">
                      <h3 className="text-3xl font-bold text-white mb-4">Discover the Future of Technology</h3>
                      <p className="text-blue-100 mb-6">Explore the latest trends and innovations in the tech world</p>
                    </div>
                  </div>
                </div>
              </div>

              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">TOP AUTHORS</h2>
                  <div className="ml-4 h-1 bg-blue-600 flex-grow rounded-full"></div>
                </div>
                <TopAuthors />
              </section>

              <section id="all-blogs-section" className="mb-12">
                <div className="flex items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">ALL BLOGS</h2>
                  <div className="ml-4 h-1 bg-blue-600 flex-grow rounded-full"></div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-medium">{currentBlogs.length}</span> of <span className="font-medium">{filteredBlogs.length}</span> results
                    {filteredBlogs.length > 0 && totalPages > 0 && (
                      <>
                      {" "}
                      - Page <span className="font-medium">{currentPage}</span> of{" "}
                      <span className="font-medium">{totalPages}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Items per page:</span>
                    <select
                      value={blogsPerPage}
                      onChange={handlePageSizeChange}
                      className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                    >
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                    </select>
                  </div>
                </div>

                {currentBlogs.length > 0 ? (
                    <BlogList blogs={currentBlogs} setBlogs={setBlogs} layout="grid" />
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-lg">
                            {searchTerm ? `No posts matching "${searchTerm}" were found.` : "No blog posts available."}
                        </p>
                    </div>
                )}

                {totalPages > 1 && (
                  <div className="flex justify-center mt-10 mb-6 space-x-2">
                    <button
                      onClick={() => handlePageButtonClick(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded border border-gray-50 text-sm bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, idx) => (
                      <button
                        key={idx + 1}
                        onClick={() => handlePageButtonClick(idx + 1)}
                        className={`px-4 py-2 rounded border text-sm ${
                          currentPage === idx + 1
                            ? "text-blue-500 border-gray-50 bg-gray-50"
                            : "bg-gray-50 text-gray-700 border-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageButtonClick(Math.min(currentPage + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded border border-gray-50 text-sm bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
