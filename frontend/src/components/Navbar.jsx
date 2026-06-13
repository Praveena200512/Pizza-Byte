import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <nav className="custom-navbar">
      <Link className="brand" to="/">
        🍕 Pizza Byte
      </Link>

      <div className="nav-links">
        {userInfo ? (
          <>
            {userInfo.user.role === "admin" ? (
              <>
                <Link to="/admin/dashboard">Admin</Link>
                <Link to="/admin/orders">Orders</Link>
                <Link to="/admin/inventory">Inventory</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/my-orders">My Orders</Link>
                <Link to="/build-pizza">Build Pizza</Link>
              </>
            )}

            <span className="user-name">Hi, {userInfo.user.name}</span>

            <button onClick={logoutHandler}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;