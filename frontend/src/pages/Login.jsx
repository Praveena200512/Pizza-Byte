import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

function Login() {
  const navigate = useNavigate();

 const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("userInfo", JSON.stringify(data));

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const googleLoginHandler = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const { data } = await API.post("/auth/google-login", {
        name: result.user.displayName,
        email: result.user.email
      });

      localStorage.setItem("userInfo", JSON.stringify(data));

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
      setError("Google login failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <div className="card shadow">
        <div className="card-body">
          <h3 className="text-center mb-4">Login</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label>Email</label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="btn btn-danger w-100">Login</button>
          </form>

          <div className="text-center my-3">
            <span className="text-muted">OR</span>
          </div>

          <button
            type="button"
            className="btn btn-outline-danger w-100"
            onClick={googleLoginHandler}
          >
            🔐 Continue with Google
          </button>

          <p className="mt-3 text-center">
            New user? <Link to="/register">Register</Link>
          </p>

          <p className="text-center">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;