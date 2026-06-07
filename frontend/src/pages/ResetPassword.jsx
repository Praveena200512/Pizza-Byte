import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";

function ResetPassword() {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const { data } = await API.post(`/auth/reset-password/${token}`, {
        password
      });

      setMessage(data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
      setMessage("");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <div className="card shadow">
        <div className="card-body">
          <h3 className="text-center mb-4">Reset Password</h3>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label>New Password</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label>Confirm Password</label>
              <input
                className="form-control"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-danger w-100">
              Reset Password
            </button>
          </form>

          <p className="mt-3 text-center">
            <Link to="/login">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;