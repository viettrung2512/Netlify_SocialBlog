import { useState, useEffect } from "react"
import NavBar from "../../../components/Header/NavBar"
import SideBar from "../../../components/Sidebar/SideBar"
import BlogList from "../../../components/Blog/BlogList"
import { TrendingUp, Filter, RefreshCw } from "lucide-react"

const PopularPage = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [timeFilter, setTimeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const blogsPerPage = 6

  const fetchPopularBlogs = async () => {
    const token = localStorage.getItem("token")

    try {
      setLoading(true)
      const response = await fetch(
        `/api/posts/most-liked${timeFilter !== "all" ? `?period=${timeFilter}` : ""}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch popular posts.")
      }

      const data = await response.json()

      if (data) {
        setBlogs(data.content)
      } else {
        console.error("Dữ liệu không hợp lệ", data)
        setBlogs([])
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error)
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastBlog = currentPage * blogsPerPage
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog)
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage)

  useEffect(() => {
    fetchPopularBlogs()
  }, [timeFilter])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, timeFilter])

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <header>
        <NavBar setSearchTerm={setSearchTerm} />
      </header>
      <main className="flex">
        <aside className="w-60">
          <SideBar />
        </aside>
        <section className="flex-1 p-6 max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 mt-16 shadow-lg text-white">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-8 h-8 mr-3" />
              <h1 className="text-3xl font-bold">Popular Posts</h1>
            </div>
            <p className="text-indigo-100 max-w-2xl">
              Discover the most liked and trending content from our community. These posts have captured the attention
              of readers worldwide.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["all", "week", "month", "year"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    timeFilter === filter
                      ? "bg-white text-indigo-600"
                      : "bg-indigo-700 text-white hover:bg-indigo-800"
                  }`}
                >
                  {filter === "all"
                    ? "All Time"
                    : filter === "week"
                    ? "This Week"
                    : filter === "month"
                    ? "This Month"
                    : "This Year"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Filter className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-gray-700 font-medium">
                {filteredBlogs.length} {filteredBlogs.length === 1 ? "post" : "posts"} found
              </span>
            </div>
            <button
              onClick={fetchPopularBlogs}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-16">
                <div className="relative w-16 h-16">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-100 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-500 text-lg">Loading popular posts...</p>
              </div>
            ) : currentBlogs.length > 0 ? (
              <>
                <BlogList blogs={currentBlogs} setBlogs={setBlogs} />

                {totalPages > 1 && (
                  <div className="flex justify-center mt-6 space-x-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded border-white text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`px-3 py-1 rounded border text-sm ${
                          currentPage === idx + 1
                            ? "text-blue-500 border-white bg-white"
                            : "bg-white text-gray-700 border-white hover:bg-gray-100"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border-white border text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No popular posts found</h3>
                <p className="text-gray-500 max-w-md">
                  {searchTerm
                    ? `No posts matching "${searchTerm}" were found. Try a different search term.`
                    : "There are no popular posts available for the selected time period."}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default PopularPage
