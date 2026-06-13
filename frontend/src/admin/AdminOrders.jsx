import { useEffect, useState } from "react";
import API from "../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders/admin/all");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusHandler = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/admin/status/${orderId}`, {
        orderStatus: newStatus
      });

      setMessage("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      setMessage(error.response?.data?.message || "Status update failed");
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <h2>Admin Orders</h2>

      {message && <div className="alert alert-info">{message}</div>}

      {orders.map((order) => (
        <div className="card shadow-sm mb-4" key={order._id}>
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <h5>Order ID: {order._id}</h5>
              <span className="badge bg-danger fs-6">{order.orderStatus}</span>
            </div>

            <hr />

            <p>
              <strong>Customer:</strong> {order.user?.name}
            </p>

            <p>
              <strong>Email:</strong> {order.user?.email}
            </p>

            <p>
              <strong>Total:</strong> ₹{order.totalPrice}
            </p>

            <p>
              <strong>Payment:</strong> {order.paymentStatus}
            </p>

            <h6>Pizza Ingredients:</h6>

            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.category} - ₹{item.price}
                </li>
              ))}
            </ul>

            <div className="row mt-3">
              <div className="col-md-4">
                <label>Update Status</label>
                <select
                  className="form-control"
                  value={order.orderStatus}
                  onChange={(e) => statusHandler(order._id, e.target.value)}
                >
                  <option value="Order Received">Order Received</option>
                  <option value="In the Kitchen">In the Kitchen</option>
                  <option value="Sent to Delivery">Sent to Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Order Completed">Order Completed ✅</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ))}

      {orders.length === 0 && <p>No orders found.</p>}
    </div>
  );
}

export default AdminOrders;