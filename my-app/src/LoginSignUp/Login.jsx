import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.jsx"; 

import user_icon from "../Assets/person.png"; 
import password_icon from "../Assets/password.png"; 

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [loginType, setLoginType] = useState("user"); 

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null); 
    setLoading(true);

    try {
      // FIX: Consistent endpoint to match server.js app.use('/api/auth', authRoutes)
      const loginEndpoint = "/api/auth/login"; 
      
      // FIX: Send specific ID keys based on selection
      const payload = loginType === "admin" 
        ? { adminId: userId, password: password, role: 'admin' } 
        : { userId: userId, password: password, role: 'user' };

      const res = await api.post(loginEndpoint, payload);

      if (res.status === 200 && res.data.token) {
        // Save Token
        localStorage.setItem("token", res.data.token);
        
        // Use the role from response to store data in the correct key
        const userRole = res.data.role; 
        const userData = res.data[userRole]; 
        
        localStorage.setItem(userRole, JSON.stringify(userData)); 

        // Clear existing stale data
        if (userRole === "admin") {
            localStorage.removeItem("user");
            navigate("/admin");
        } else {
            localStorage.removeItem("admin");
            navigate("/dashboard");
        }
      } 
    } catch (err) {
      console.error("Login error:", err);
      let errorMessage = "Invalid credentials or server error.";
      
      if (err.response) {
        // Handle specific server responses
        errorMessage = err.response.data.msg || err.response.data.message || errorMessage;
      } else if (err.request) {
        errorMessage = "Network error. Server is not responding.";
      }
      
      setMessage({ type: 'error', text: errorMessage });
      localStorage.clear(); // Safety clear on failure
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f1e] w-full p-4">
      <div className="flex flex-col w-full max-w-sm pb-[30px] bg-[#1a1a2e] rounded-[15px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[#2e2e42]">
        <div className="flex flex-col items-center gap-2.5 w-full mt-7">
          <div className="text-[#ff6347] text-4xl font-bold">Login</div>
          <div className="w-[61px] h-1.5 bg-gradient-to-r from-[#ff6347] to-[#ff9478] rounded-[9px]" />
        </div>

        <form onSubmit={handleLogin} className="mt-[30px] flex flex-col gap-6 px-7">
          {message && (
            <div className={`p-3 rounded-md text-sm font-medium ${
                message.type === "error" ? "bg-red-900 text-red-300 border border-red-700" : "bg-green-900 text-green-300 border border-green-700"
              }`}>
              {message.text}
            </div>
          )}

          {/* Role Selection Toggle */}
          <div className="flex justify-center gap-2">
            {['user', 'admin'].map((role) => (
              <button
                key={role}
                type="button" 
                onClick={() => setLoginType(role)}
                className={`px-4 py-2 w-full rounded-md text-sm font-medium capitalize transition-colors ${
                  loginType === role ? 'bg-gradient-to-r from-[#ff6347] to-[#ff9478] text-white shadow-lg' : 'bg-[#2e2e42] text-gray-400'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* ID Input */}
          <div className="flex items-center mx-auto w-full h-[60px] bg-[#2e2e42] rounded-lg border border-[#444466] focus-within:border-[#ff6347]">
            <img src={user_icon} alt="icon" className="mx-4 h-5 w-5 invert" />
            <input
              type="text"
              placeholder={loginType === 'user' ? 'User ID' : 'Admin ID'} 
              value={userId}
              onChange={(e) => setUserId(e.target.value)} 
              required
              className="h-[50px] w-full bg-transparent text-white outline-none"
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center mx-auto w-full h-[60px] bg-[#2e2e42] rounded-lg border border-[#444466] focus-within:border-[#ff6347]">
            <img src={password_icon} alt="icon" className="mx-4 h-5 w-5 invert" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-[50px] w-full bg-transparent text-white outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`flex justify-center items-center w-full h-[60px] text-white bg-gradient-to-r from-[#ff6347] to-[#ff9478] rounded-lg text-lg font-bold transition-all ${
              loading ? 'opacity-60' : 'hover:shadow-[0_0_15px_rgba(255,99,71,0.6)]'
            }`}
          >
            {loading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" /> : 'Login'}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-4 text-sm">
          Don't have an account?{" "}
          <span className="text-[#ff6347] cursor-pointer hover:underline" onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;