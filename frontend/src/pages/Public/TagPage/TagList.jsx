import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../../../components/Header/NavBar";
import SideBar from "../../../components/Sidebar/SideBar";
import BlogList from "../../../components/Blog/BlogList"; 
const TagList = () => {
  const { categoryName } = useParams(); 
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/api/posts`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const filteredBlogs = data.content.filter(
          (blog) => blog.category === categoryName
        );
        setBlogs(filteredBlogs); 
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false); 
      });
  }, [categoryName]);

  return (
    <div className="bg-white min-h-screen text-black">
      <header>
        <NavBar />
      </header>
      <main>
        <div className="flex">
          <aside className="w-60">
            <SideBar />
          </aside>
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold mb-4 mt-20">
              Blogs in #{categoryName}
            </h2>
            <div className="space-y-4">
              {isLoading ? (
                <p>Loading...</p> 
              ) : (
                <BlogList blogs={blogs} setBlogs={setBlogs} layout="grid" />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TagList;
