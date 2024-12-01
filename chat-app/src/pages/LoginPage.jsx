import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { io } from "socket.io-client";

const LoginPage = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const socket = io("http://localhost:5000", {
    transports: ['websocket', 'polling'],
    withCredentials: true,
    auth: {
      token: Cookies.get("token")
    }
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        username,
        password
      });
      Cookies.set("token", response.data.data, { expires: 1, secure: false });
      socket.emit('setUsername', username);

      setIsAuthenticated(true);
      navigate('/');
      setLoading(false);
    } catch (error) {
      setError(error.response ? error.response.data.errors : error.message);
      console.error("Login failed:", error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-200">
      <div className="w-full max-w-md border border-black bg-white [box-shadow:3px_5px_0_black] rounded-md">
        <div className="flex flex-col p-8">
          <span className="block mb-1 text-2xl font-semibold">Login Page</span>
          <span className="block mb-3 text-slate-800">Enter your username and password</span>
          <form action="" className="*:w-full" onSubmit={handleLogin}>
            <label htmlFor="username" className="block">Username</label>
            <input type="text" name="username" className="bg-transparent border-b-2 border-black focus:outline-none focus:border-blue-600 py-2 mb-3"
              placeholder="Your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="password" className="block">Password</label>
            <input type="password" name="username" className="bg-transparent border-b-2 border-black focus:outline-none focus:border-blue-600 py-2 mb-5"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="mb-3 text-red-500">{error}</p>}
            <button type="submit" className="w-full bg-sky-200 py-2 border border-black rounded-md text-lg [box-shadow:3px_5px_0_black] active:[box-shadow:1px_3px_0_black] active:translate-y-1">
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

LoginPage.propTypes = {
  setIsAuthenticated: PropTypes.bool.isRequired
}

export default LoginPage