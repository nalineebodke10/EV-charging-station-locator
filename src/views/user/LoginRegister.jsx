// src/pages/LoginRegister.jsx
import React, { useState } from "react";
import video from "../../assets/videos/video.mp4";
import axios from "axios";
import { useNavigate } from "react-router";

function LoginRegister() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            // ✅ Login API
            try {
                const response = await axios.post("http://localhost:8081/api/auth/login", {
                    email,
                    password,
                });

                // ✅ Expecting { id, name, email, token } from backend
                const { id, name, token } = response.data;

                // Save auth info
                localStorage.setItem("userId", id);
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(response.data));

                console.log("Login success:", response.data);
                alert("Login successful! Welcome " + name);

                navigate("/");

            } catch (error) {
                console.error("Login error:", error);
                if (error.response && error.response.status === 401) {
                    alert("Invalid password");
                } else if (error.response && error.response.status === 404) {
                    alert("User not found");
                } else {
                    alert("Login failed!");
                }
            }
        } else {
            // ✅ Register API
            try {
                const response = await axios.post("http://localhost:8081/api/auth/register", {
                    name,
                    email,
                    password,
                });
                console.log("Registered:", response.data);
                alert("Registration successful!");
                setIsLogin(true); // switch to login after success
            } catch (error) {
                console.error("Error registering:", error);
                alert("Registration failed!");
            }
        }
    };

    return (
        <div className="relative h-screen w-screen">
            {/* Fullscreen Video */}
            <video
                src={video}
                autoPlay
                loop
                muted
                className="fixed inset-0 w-full h-full object-cover"
            />

            {/* Form on top of video */}
            <div className="relative z-10 flex items-center justify-center h-full">
                <div className="bg-[#ffffff40] backdrop-blur-sm p-8 rounded-2xl w-96 mt-[-100px]">
                    <h2 className="text-2xl font-bold text-center mb-6 text-white">
                        {isLogin ? "Login" : "Register"}
                    </h2>

                    {isLogin ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border rounded text-[#ffffff] outline-none"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border rounded text-white outline-none"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full rounded-md px-3 py-1.5 
                                bg-gradient-to-r from-[#93ed85] to-[#d0ffdd] 
                                text-[#414040] font-semibold 
                                shadow-[0_0_15px_rgba(147,237,133,0.6)] 
                                hover:shadow-[0_0_25px_rgba(208,255,221,0.9)] 
                                transition-all duration-300 cursor-pointer"
                            >
                                Login
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 border rounded text-white outline-none"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border rounded text-white outline-none"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border rounded text-white outline-none"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full rounded-md px-3 py-1.5
                                bg-gradient-to-r from-[#93ed85] to-[#d0ffdd]
                                text-[#414040] font-semibold
                                shadow-[0_0_15px_rgba(147,237,133,0.6)]
                                hover:shadow-[0_0_25px_rgba(208,255,221,0.9)]
                                transition-all duration-300 cursor-pointer"
                            >
                                Register
                            </button>
                        </form>
                    )}

                    <p className="text-center text-white mt-4 text-sm">
                        {isLogin ? (
                            <>
                                Don’t have an account?{" "}
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className="relative font-semibold 
                                    bg-gradient-to-r from-[#daffd4] to-[#d9ffe4] bg-clip-text text-transparent 
                                    [text-shadow:0_0_10px_rgba(147,237,133,0.6)]
                                    hover:[text-shadow:0_0_20px_rgba(208,255,221,0.9)] 
                                    transition-all duration-300 underline cursor-pointer"
                                >
                                    Register
                                </button>
                            </>
                        ) : (
                            <>
                                Already registered?{" "}
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className="relative font-semibold 
                                    bg-gradient-to-r from-[#daffd4] to-[#d9ffe4] bg-clip-text text-transparent 
                                    [text-shadow:0_0_10px_rgba(147,237,133,0.6)]
                                    hover:[text-shadow:0_0_20px_rgba(208,255,221,0.9)] 
                                    transition-all duration-300 underline cursor-pointer"
                                >
                                    Login
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginRegister;
