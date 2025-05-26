"use client";

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BlogList from "../../../components/Blog/BlogList";
import NavBar from "../../../components/Header/NavBar";
import SideBar from "../../../components/Sidebar/SideBar";
import { Bookmark, ChevronLeft, BookOpen, Search, Grid } from "lucide-react";

const SavedBlogsPage = () => {
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertShown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedBlogs = async () => {
      const token = localStorage.getItem("token");
      if (!token && !alertShown) {
        navigate("/*");
        return;
      }

      try {
        const response = await fetch(`/bookmarks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSavedBlogs(data);
        } else {
          const errorData = await response.json();
          console.error("Error fetching saved blogs:", errorData.message);
        }
      } catch (error) {
        console.error("API connection error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedBlogs();
  }, [alertShown, navigate]);

  const filteredBlogs = savedBlogs.filter((blog) =>
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <NavBar />
      </header>

      <div className="flex pt-16">
        <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-900 w-60 z-40 shadow-lg">
          <SideBar />
        </aside>

        <div className="ml-60 flex-grow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 rounded-full bg-white text-gray-600 hover:bg-gray-100 transition-colors shadow-sm"
                aria-label="Go back"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Bookmark className="h-8 w-8 mr-3 text-purple-600" />
                Bookmarks
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex space-x-2">
                <button
                  className={`p-2 rounded-lg ${
                    viewMode === "grid"
                      ? "bg-purple-100 text-purple-700 border border-purple-200"
                      : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                >
                  <Grid className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <Bookmark className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Bookmarks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {savedBlogs.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(savedBlogs.map((blog) => blog.category)).size}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-pink-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Saved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {savedBlogs.length > 0
                      ? new Date(savedBlogs[0].createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full absolute border-4 border-gray-200"></div>
                  <div className="w-16 h-16 rounded-full animate-spin absolute border-4 border-purple-600 border-t-transparent"></div>
                </div>
                <p className="mt-8 text-xl font-medium text-gray-700">
                  Loading your bookmarks...
                </p>
                <p className="mt-2 text-gray-500">This may take a moment</p>
              </div>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <BlogList
                blogs={filteredBlogs}
                setBlogs={setSavedBlogs}
                layout={viewMode}
              />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="w-24 h-24 mx-auto bg-purple-50 rounded-full flex items-center justify-center mb-6">
                <Bookmark className="h-12 w-12 text-purple-300" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                {searchTerm
                  ? "No matching bookmarks found"
                  : "No bookmarks yet"}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchTerm
                  ? `We couldn't find any bookmarks matching "${searchTerm}". Try a different search term or clear your search.`
                  : "Start saving your favorite articles to read them later. Explore our content and bookmark what interests you."}
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
                Explore Articles
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedBlogsPage;
