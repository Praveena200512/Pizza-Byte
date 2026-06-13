import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [inventory, setInventory] = useState([]);
  const [latestOrder, setLatestOrder] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const inventoryRes = await API.get("/inventory");
      const orderRes = await API.get("/orders/my-orders");

      setInventory(inventoryRes.data);

      if (orderRes.data.length > 0) {
        setLatestOrder(orderRes.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getCategoryItems = (category) => {
    return inventory.filter((item) => item.category === category);
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>User Dashboard</h2>
          <p>Welcome, {userInfo?.user?.name}</p>
        </div>

        <Link to="/build-pizza" className="btn btn-danger">
          Build Pizza
        </Link>
        <Link to="/ready-pizza" className="btn btn-warning ms-2">
          Order Ready-Made Pizza
        </Link>
      </div>

      {latestOrder && (
        <div className="card shadow-sm mb-4 border-danger">
          <div className="card-body">
            <h4>Latest Order Status</h4>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  latestOrder.orderStatus === "Order Completed"
                    ? "badge bg-success"
                    : "badge bg-danger"
                }
              >
                {latestOrder.orderStatus === "Order Completed"
                  ? "✅ Order Completed"
                  : latestOrder.orderStatus}
              </span>
            </p>
            <p>
              <strong>Total:</strong> ₹{latestOrder.totalPrice}
            </p>
            <Link to="/my-orders" className="btn btn-warning btn-sm">
              View All Orders
            </Link>
          </div>
        </div>
      )}

      <h4 className="mb-3">Available Pizza Varieties</h4>

      <CategorySection title="Pizza Bases" items={getCategoryItems("base")} />
      <CategorySection title="Sauces" items={getCategoryItems("sauce")} />
      <CategorySection title="Cheese Types" items={getCategoryItems("cheese")} />
      <CategorySection title="Veggies" items={getCategoryItems("veggie")} />
      <CategorySection title="Meat Options" items={getCategoryItems("meat")} />
    </div>
  );
}

function CategorySection({ title, items }) {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5>{title}</h5>

        <div className="row">
          {items.map((item) => (
            <div className="col-md-3 mb-3" key={item._id}>
              <div className="card h-100 text-center">
                <div className="card-body">
                  <h6>{item.name}</h6>
                  <p className="mb-1">₹{item.price}</p>

                  {item.stock > 0 ? (
                    <span className="badge bg-success">Available</span>
                  ) : (
                    <span className="badge bg-danger">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && <p>No items available.</p>}
      </div>
    </div>
  );
}

export default Dashboard;