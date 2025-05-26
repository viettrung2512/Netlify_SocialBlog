import { Link } from "react-router-dom";
import { 
  FaBookmark, 
  FaTag, 
  FaFire, 
  FaCommentDots, 
  FaHistory 
} from "react-icons/fa";

const SideBar = () => {
  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800 p-6 flex flex-col fixed border-r border-gray-200 shadow-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Menu
        </h1>
      </div>
      <ul className="space-y-2">
        <li>
          <Link
            to="/saved"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 ease-in-out text-lg font-medium"
          >
            <FaBookmark className="text-xl" />
            <span>Bookmarks</span>
          </Link>
        </li>
        <li>
          <Link
            to="/category"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 ease-in-out text-lg font-medium"
          >
            <FaTag className="text-xl" />
            <span>Tag</span>
          </Link>
        </li>
        <li>
          <Link
            to="/popular"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 ease-in-out text-lg font-medium"
          >
            <FaFire className="text-xl" />
            <span>Popular</span>
          </Link>
        </li>
        <li>
          <Link
            to="/feedback"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 ease-in-out text-lg font-medium"
          >
            <FaCommentDots className="text-xl" />
            <span>Feedback</span>
          </Link>
        </li>
        <li>
          <Link
            to="/history"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 ease-in-out text-lg font-medium"
          >
            <FaHistory className="text-xl" />
            <span>History</span>
          </Link>
        </li>
      </ul>
      <div className="mt-auto">
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-500 text-center">
            © 2025 Your App
          </p>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;