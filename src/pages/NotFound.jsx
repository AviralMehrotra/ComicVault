import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-indigo-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        <Link
          to="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;

