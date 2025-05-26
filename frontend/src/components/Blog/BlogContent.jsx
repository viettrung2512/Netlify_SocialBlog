import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import CommentButton from "../Button/CommentButton";
import RelatedBlogs from "./RelatedBlogs";
import DOMPurify from "dompurify";
import BlogAudio from "../Button/BlogAudio";
import ReportButton from "../Button/ReportButton";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MessageCircle,
  Heart,
  Tag,
  User,
} from "lucide-react";

const BlogContent = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogData = async () => {
      const token = localStorage.getItem("token");
      setLoading(true);
      try {
        const response = await fetch(`/api/posts/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          navigate("/*");
          throw new Error("Failed to fetch blog data");
        }
        let blogData = await response.json();
        blogData = {
          ...blogData,
          likeCount:
            blogData.likeCount ||
            blogData.likeCnt ||
            (blogData.likes ? blogData.likes.length : 0),
          _id: blogData._id || blogData.id,
        };
        setBlog(blogData);
        setLikeCount(blogData.likeCount || 0);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id, navigate]);

useEffect(() => {
  let hasSaved = false;
  const saveHistory = async () => {
    if (hasSaved) return;
    hasSaved = true;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch("/api/history/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId: id, 
          description: "Viewed the post",
        }),
      });
    } catch (error) {
      console.error("Failed to save history:", error);
    }
  };

  saveHistory();
}, [id]); 
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const estimateReadingTime = (content) => {
    if (!content) return "5 min read";
    const text = content.replace(/<[^>]*>/g, "");
    const wordCount = text.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    return `${readingTime} min read`;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 relative">
          <div className="w-16 h-16 rounded-full absolute border-4 border-gray-200"></div>
          <div className="w-16 h-16 rounded-full animate-spin absolute border-4 border-blue-600 border-t-transparent"></div>
        </div>
        <p className="mt-4 text-gray-600 text-lg font-medium">
          Loading article...
        </p>
      </div>
    );
  }

  const sanitizedContent = DOMPurify.sanitize(blog.content);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="max-w-5xl mx-auto pt-8 px-4 sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back to blogs</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="relative h-96 w-full bg-gray-100">
            <img
              src={blog.imageCloudUrl || "/placeholder.svg"}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white">
                {blog.category}
              </span>
            </div>
          </div>
          <div className="px-6 py-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center text-gray-600 text-sm mb-6">
              <span className="flex items-center mr-6">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(blog.createdAt)}
              </span>
              <span className="flex items-center mr-6">
                <Clock className="h-4 w-4 mr-1" />
                {estimateReadingTime(blog.content)}
              </span>
              <span className="flex items-center">
                <Heart className="h-4 w-4 mr-1 text-pink-500" />
                {likeCount} likes
              </span>
            </div>
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <Tag className="h-4 w-4 text-gray-500" />
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="md:hidden flex items-center p-4 bg-gray-50 rounded-xl mb-6">
              <a href={`/profile/${blog.author._id}`} className="flex-shrink-0">
                <img
                  src={blog.author.profilePicture || "/placeholder.svg"}
                  alt={blog.author.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                />
              </a>
              <div className="ml-3">
                <a
                  href={`/profile/${blog.author._id}`}
                  className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {blog.author.name}
                </a>
                <p className="text-sm text-gray-500">{blog.author.email}</p>
              </div>
            </div>

            <div className="max-w-none">
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                style={{
                  "--tw-prose-headings": "#111827",
                  "--tw-prose-links": "#2563eb",
                }}
              />
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex space-x-4">
                  <BlogAudio blogText={blog.content} />
                  <ReportButton
                    reportText={blog.content}
                    id={blog._id}
                    type={"Post"}
                    message={"Report Post"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8 px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="hidden md:block">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <div className="px-6 pb-6 text-center">
                <div className="-mt-12 mb-4">
                  <a href={`/profile/${blog.author._id}`}>
                    <img
                      src={blog.author.profilePicture || "/placeholder.svg"}
                      alt={blog.author.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white"
                    />
                  </a>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  <a
                    href={`/profile/${blog.author._id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {blog.author.name}
                  </a>
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {blog.author.email}
                </p>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <a
                    href={`/profile/${blog.author._id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                Join the conversation
              </h2>
              <CommentButton blogId={id} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-3 gap-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Related Articles
          </h2>
          <RelatedBlogs tag={blog.tags[0]} postId={blog._id} />
        </div>
      </div>
    </div>
  );
};

export default BlogContent;
