import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";

function VerifyEmail() {
  const { token } = useParams();

  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { data } = await API.get(`/auth/verify-email/${token}`);
        setMessage(data.message);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Email verification failed");
        setMessage("");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow text-center">
        <div className="card-body">
          <h3 className="mb-4">Email Verification</h3>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <Link to="/login" className="btn btn-danger mt-3">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;