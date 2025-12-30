import { useState, useEffect, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { getComicUrl } from "@/utils/comicUtils";

const SearchOverlay = ({ isOpen, onClose, onSearch }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const debounceRef = useRef(null);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const result = await onSearch(searchQuery);
    if (result?.success) {
      setResults(result.data);
    } else {
      setResults([]);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.trim()) {
      // Set new timeout for 500ms
      debounceRef.current = setTimeout(() => {
        handleSearch(value);
      }, 1000);
    } else {
      setResults([]);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Search Container */}
      <div className="relative flex items-start justify-center pt-32">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
          <form onSubmit={handleSubmit} className="p-4">
            <div className="flex items-center gap-4">
              <FiSearch className="text-gray-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search for comics..."
                className="flex-1 text-lg outline-none placeholder-gray-400"
                autoFocus
              />
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            </div>

            {loading && (
              <div className="mt-4 text-center text-gray-500">Searching...</div>
            )}

            {results.length > 0 && (
              <div className="mt-4 max-h-96 overflow-y-auto border-t">
                {results.map((comic, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-50 border-b last:border-b-0 flex gap-3 cursor-pointer"
                    onClick={() => {
                      if (comic.apiDetailUrl) {
                        const comicUrl = getComicUrl(comic.apiDetailUrl);
                        window.location.href = comicUrl;
                      }
                    }}
                  >
                    {comic.image && (
                      <img
                        src={comic.image}
                        alt={comic.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{comic.title}</h3>
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {comic.description}
                      </p>
                      <div className="mt-1 text-xs text-gray-500">
                        {comic.year && <span>{comic.year}</span>}
                        {comic.publisher && (
                          <span className="ml-2">{comic.publisher}</span>
                        )}
                        {comic.issueCount && (
                          <span className="ml-2">
                            <strong>Issues:</strong> {comic.issueCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
