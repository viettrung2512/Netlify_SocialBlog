import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (token) {
      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password!");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("profilePicture", data.profilePicture || "");
      localStorage.setItem("userId", data.id);
      localStorage.setItem("userRole", data.userRole);

      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
      });

      if (data.userRole === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      // 1. Gọi API xác thực
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include", // Quan trọng cho session/cookie
          body: JSON.stringify({ token }),
        }
      );

      // 2. Xử lý response
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Google login failed!");
      }

      const data = await response.json();

      // 3. Lưu thông tin người dùng
      const authData = {
        token: data.token,
        username: data.username,
        profilePicture: data.profilePicture || "/default-avatar.png", // Fallback avatar
        userId: data.id,
        userRole: data.userRole || "USER", // Mặc định là USER nếu không có
      };

      // Lưu vào localStorage
      Object.entries(authData).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      // 4. Hiển thị thông báo và chuyển hướng
      toast.success("Đăng nhập thành công!", {
        position: "top-right",
        autoClose: 2000,
        onClose: () => {
          // Chuyển hướng sau khi toast đóng
          navigate(data.userRole === "ADMIN" ? "/admin" : "/", {
            replace: true, // Ngăn quay lại trang login
          });
        },
      });
    } catch (error) {
      console.error("Google login error:", error);

      // Hiển thị lỗi chi tiết hơn
      const errorMessage = error.message.includes("Failed to fetch")
        ? "Lỗi kết nối đến server"
        : error.message;

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  return (
    <div>
      <section className="h-screen">
        <div className="px-6 h-full text-gray-800">
          <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
            <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="w-full"
                alt="Sample"
              />
            </div>
            <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
              <form onSubmit={handleLogin}>
                <div className="mb-6">
                  <label htmlFor="username" className="block mb-1 text-sm">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white border rounded focus:outline-none"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="password" className="block mb-1 text-sm">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white border rounded focus:outline-none"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-center lg:text-left">
                  <button
                    type="submit"
                    className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </button>
                  <p className="text-sm font-semibold mt-2 pt-1 mb-0">
                    Don’t have an account?{" "}
                    <Link
                      to="/register"
                      className="text-red-600 hover:text-red-700"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>
              {error && <p className="text-red-600">{error}</p>}
              <div className="mt-4">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => toast.error("Google login failed!")}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
