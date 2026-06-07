import { useEffect, useState } from "react";
import API from "../services/api";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const { data } = await API.get("/orders/my-orders");
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mt-4">
      <h2>My Orders</h2>

      {orders.map((order) => (
        <div className="card shadow-sm mb-3" key={order._id}>
          <div className="card-body">
            <h5>Order ID: {order._id}</h5>
            <p><strong>Status:</strong> {order.orderStatus}</p>
            <p><strong>Payment:</strong> {order.paymentStatus}</p>
            <p><strong>Total:</strong> ₹{order.totalPrice}</p>

            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.category} - ₹{item.price}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {orders.length === 0 && <p>No orders yet.</p>}
    </div>
  );
}

export default MyOrders;