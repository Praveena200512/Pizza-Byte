import { Link } from "react-router-dom";

function AdminDashboard() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <p>Welcome, {userInfo?.user?.name}</p>

      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card p-4 shadow-sm">
            <h4>Inventory Management</h4>
            <p>Manage pizza base, sauce, cheese, veggies, and meat.</p>
            <Link to="/admin/inventory" className="btn btn-danger">
              Manage Inventory
            </Link>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card p-4 shadow-sm">
            <h4>Orders</h4>
            <p>View and update pizza order status.</p>
            <Link to="/admin/orders" className="btn btn-warning">
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;