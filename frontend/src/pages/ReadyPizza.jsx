import { useEffect, useState } from "react";
import API from "../services/api";

const getPizzaImage = (name) => {
  const n = name.toLowerCase();

  if (n.includes("margherita")) return "/image/margherita.jpg";
  if (n.includes("farmhouse")) return "/image/farmhouse.jpg";
  if (n.includes("paneer")) return "/image/paneer.jpg";
  if (n.includes("veggie")) return "/image/veggie.jpg";
  if (n.includes("chicken")) return "/image/chickenpizza.jpg";
  if (n.includes("pepperoni")) return "/image/pepperonipizza.jpg";

  return "/image/thincrust.png";
};

function ReadyPizza() {
  const [pizzas, setPizzas] = useState([]);
  const [cart, setCart] = useState({});
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const fetchPizzas = async () => {
    try {
      const { data } = await API.get("/inventory/category/readyPizza");
      setPizzas(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  const increaseQty = (pizza) => {
    setCart({
      ...cart,
      [pizza._id]: {
        ...pizza,
        qty: cart[pizza._id] ? cart[pizza._id].qty + 1 : 1
      }
    });
  };

  const decreaseQty = (pizza) => {
    if (!cart[pizza._id]) return;

    if (cart[pizza._id].qty === 1) {
      const updatedCart = { ...cart };
      delete updatedCart[pizza._id];
      setCart(updatedCart);
    } else {
      setCart({
        ...cart,
        [pizza._id]: {
          ...cart[pizza._id],
          qty: cart[pizza._id].qty - 1
        }
      });
    }
  };

  const addressChangeHandler = (e) => {
    setDeliveryAddress({
      ...deliveryAddress,
      [e.target.name]: e.target.value
    });
  };

  const cartItems = Object.values(cart);

  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.qty;
  }, 0);

  const prepareItems = () => {
    let items = [];

    cartItems.forEach((pizza) => {
      for (let i = 0; i < pizza.qty; i++) {
        items.push({
          itemId: pizza._id,
          name: pizza.name,
          category: pizza.category,
          price: pizza.price
        });
      }
    });

    return items;
  };

  const payNow = async () => {
    if (cartItems.length === 0) {
      alert("Please add at least one pizza");
      return;
    }

    if (
      !deliveryAddress.fullName ||
      !deliveryAddress.phone ||
      !deliveryAddress.address ||
      !deliveryAddress.city ||
      !deliveryAddress.pincode
    ) {
      alert("Please fill delivery address");
      return;
    }

    try {
      const { data } = await API.post("/orders/create-razorpay-order", {
        amount: totalPrice
      });

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Pizza Byte",
        description: "Ready-Made Pizza Order",
        order_id: data.orderId,

        handler: async function (response) {
          await API.post("/orders/place-order", {
            items: prepareItems(),
            totalPrice,
            deliveryAddress,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id
          });

          alert("Order placed successfully!");
          window.location.href = "/my-orders";
        },

        prefill: {
          name: userInfo.user.name,
          email: userInfo.user.email
        },

        theme: {
          color: "#dc3545"
        }
      };

      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.open();
    } catch (error) {
      alert(error.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4">🍕 Ready-Made Pizzas</h2>

      <div className="row">
        <div className="col-md-8">
          <div className="row">
            {pizzas.map((pizza) => (
              <div className="col-md-4 mb-4" key={pizza._id}>
                <div className="card h-100 pizza-card shadow-sm">
                  <div className="card-body text-center">
                    <img
                      src={getPizzaImage(pizza.name)}
                      alt={pizza.name}
                      className="item-image"
                    />

                    <h5>{pizza.name}</h5>
                    <p>Stock: {pizza.stock}</p>
                    <h6>₹{pizza.price}</h6>

                    <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => decreaseQty(pizza)}
                      >
                        -
                      </button>

                      <span className="fw-bold">
                        {cart[pizza._id]?.qty || 0}
                      </span>

                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => increaseQty(pizza)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {pizzas.length === 0 && <p>No ready-made pizzas available.</p>}
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow sticky-top" style={{ top: "80px" }}>
            <div className="card-body">
              <h4>Your Order</h4>
              <hr />

              {cartItems.length === 0 && <p>No pizza selected.</p>}

              {cartItems.map((item) => (
                <p key={item._id}>
                  {item.name} × {item.qty} = ₹{item.price * item.qty}
                </p>
              ))}

              <hr />

              <h4>Total: ₹{totalPrice}</h4>

              <hr />

              <h5>Delivery Address</h5>

              <input
                className="form-control mb-2"
                name="fullName"
                placeholder="Full Name"
                value={deliveryAddress.fullName}
                onChange={addressChangeHandler}
              />

              <input
                className="form-control mb-2"
                name="phone"
                placeholder="Phone Number"
                value={deliveryAddress.phone}
                onChange={addressChangeHandler}
              />

              <textarea
                className="form-control mb-2"
                name="address"
                placeholder="Full Address"
                value={deliveryAddress.address}
                onChange={addressChangeHandler}
              />

              <input
                className="form-control mb-2"
                name="city"
                placeholder="City"
                value={deliveryAddress.city}
                onChange={addressChangeHandler}
              />

              <input
                className="form-control mb-2"
                name="pincode"
                placeholder="Pincode"
                value={deliveryAddress.pincode}
                onChange={addressChangeHandler}
              />

              <button className="btn btn-danger w-100 mt-3" onClick={payNow}>
                Pay & Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReadyPizza;