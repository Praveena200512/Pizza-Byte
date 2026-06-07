import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger px-4 shadow-sm">
      <Link className="navbar-brand fw-bold" to="/">
        🍕 Pizza Byte
      </Link>

      <div className="ms-auto">
        {userInfo ? (
          <>
            {userInfo.user.role === "admin" ? (
              <>
                <Link className="btn btn-light btn-sm me-2" to="/admin/dashboard">
                  Admin
                </Link>

                <Link className="btn btn-warning btn-sm me-2" to="/admin/orders">
                  Orders
                </Link>
              </>
            ) : (
              <>
                <Link className="btn btn-light btn-sm me-2" to="/dashboard">
                  Dashboard
                </Link>

                <Link className="btn btn-warning btn-sm me-2" to="/my-orders">
                  My Orders
                </Link>
              </>
            )}

            <span className="text-white me-3">Hi, {userInfo.user.name}</span>

            <button className="btn btn-light btn-sm" onClick={logoutHandler}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-light btn-sm me-2" to="/login">
              Login
            </Link>

            <Link className="btn btn-warning btn-sm" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;