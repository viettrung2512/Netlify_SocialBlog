import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../.././App.css";

function SearchResults() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const prevSearchTerm = useRef(searchTerm);
  const navigate = useNavigate();
  const searchResultsRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm.trim() === "") {
        setResults([]);
        setShowResults(false);
        return;
      }
      if (prevSearchTerm.current !== searchTerm) {
        setIsLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/api/posts/search?keyword=${searchTerm}`
        );
        const data = await response.json();
        setResults(data);
        setShowResults(true);
        setIsLoading(false);
      }
      prevSearchTerm.current = searchTerm;
    };

    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClick = (id) => {
    navigate(`/blog/${id}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div className="searchBar">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleInputChange}
          className="w-full p-3 text-black rounded-xl border border-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          aria-label="Search posts"
        />
      </div>
      {showResults && (
        <div
          ref={searchResultsRef} 
          className="searchResultsContainer bg-white border border-gray-700"
        >
          {isLoading && <p>Loading results...</p>}
          {!isLoading && (
            <ul className="space-y-4">
              {results.slice(0, 5).map((result) => (
                <li
                  key={result.id}
                  className="p-4 rounded-md bg-white hover:bg-[#1A2027] cursor-pointer transition-transform transform hover:scale-105 flex items-center"
                  onClick={() => handleClick(result.id)}
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black">
                      {result.title}
                    </h3>
                    <p className="text-sm text-black">
                      <strong>Category:</strong> {result.category}
                    </p>
                    <p className="text-sm text-black">
                      <strong>Tags:</strong> {Array.isArray(result.tags) ? result.tags.join(", ") : "No tags available"}
                    </p>
                  </div>
                  {result.imageCloudUrl && (
                    <img
                      src={result.imageCloudUrl}
                      alt={result.title}
                      className="ml-4 h-16 w-16 object-cover rounded-md"
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
