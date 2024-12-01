import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import { useEffect, useState } from "react"
import Cookies from "js-cookie";
import ChatPage from "./pages/ChatPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/chat" /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
