import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ComicDetails from "./pages/ComicDetails";
import MyComics from "./pages/MyComics";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/comics"
            element={
              <ProtectedRoute>
                <MyComics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/comic/:id"
            element={
              <ProtectedRoute>
                <ComicDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
