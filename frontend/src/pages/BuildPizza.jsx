import { useEffect, useState } from "react";
import API from "../services/api";

const getItemImage = (item) => {
  const name = item.name.toLowerCase();

  if (name.includes("thin")) return "/image/thincrust.png";
  if (name.includes("cheese burst")) return "/image/cheeseburst.jpg";
  if (name.includes("wheat")) return "/image/wholewheat.png";
  if (name.includes("pan")) return "/image/panpizza.jpg";
  if (name.includes("stuffed")) return "/image/stuffedcrust.jpg";

  if (name.includes("tomato")) return "/image/tamatosauce.jpg";
  if (name.includes("barbeque")) return "/image/barbeque.jpg";
  if (name.includes("pesto")) return "/image/pesto.jpg";
  if (name.includes("alfredo")) return "/image/alfredo.jpg";
  if (name.includes("garlic")) return "/image/garlic.jpg";

  if (name.includes("mozzarella")) return "/image/mozzarella.jpg";
  if (name.includes("cheddar")) return "/image/cheddar.jpg";
  if (name.includes("parmesan")) return "/image/parmesan.jpg";

  if (name.includes("onion")) return "/image/onions.jpg";
  if (name.includes("capsicum")) return "/image/capsicum.jpg";
  if (name.includes("corn")) return "/image/corn.jpg";
  if (name.includes("olive")) return "/image/olives.jpg";
  if (name.includes("jalapeno")) return "/image/jalapeno.jpg";
  if (name.includes("mushroom")) return "/image/mushroom.jpg";

  if (name.includes("chicken")) return "/image/chicken.jpg";
  if (name.includes("pepperoni")) return "/image/pepperoni.jpg";

  return "/image/thincrust.png";
};

function BuildPizza() {
  const [bases, setBases] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [cheeses, setCheeses] = useState([]);
  const [veggies, setVeggies] = useState([]);
  const [meats, setMeats] = useState([]);

  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedCheese, setSelectedCheese] = useState(null);
  const [selectedVeggies, setSelectedVeggies] = useState([]);
  const [selectedMeat, setSelectedMeat] = useState(null);

  const [loading, setLoading] = useState(true);
  const [pizzaType, setPizzaType] = useState("veg");

  const addressChangeHandler = (e) => {
    setDeliveryAddress({
      ...deliveryAddress,
      [e.target.name]: e.target.value,
    });
  };

  const fetchInventory = async () => {
    try {
      const baseRes = await API.get("/inventory/category/base");
      const sauceRes = await API.get("/inventory/category/sauce");
      const cheeseRes = await API.get("/inventory/category/cheese");
      const veggieRes = await API.get("/inventory/category/veggie");
      const meatRes = await API.get("/inventory/category/meat");

      setBases(baseRes.data);
      setSauces(sauceRes.data);
      setCheeses(cheeseRes.data);
      setVeggies(veggieRes.data);
      setMeats(meatRes.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const toggleVeggie = (veggie) => {
    const exists = selectedVeggies.find((item) => item._id === veggie._id);

    if (exists) {
      setSelectedVeggies(
        selectedVeggies.filter((item) => item._id !== veggie._id)
      );
    } else {
      setSelectedVeggies([...selectedVeggies, veggie]);
    }
  };

  const calculateTotal = () => {
    let total = 0;

    if (selectedBase) total += selectedBase.price;
    if (selectedSauce) total += selectedSauce.price;
    if (selectedCheese) total += selectedCheese.price;

    if (pizzaType === "nonveg" && selectedMeat) {
      total += selectedMeat.price;
    }

    selectedVeggies.forEach((item) => {
      total += item.price;
    });

    return total;
  };

  const prepareItems = () => {
    const allItems = [
      selectedBase,
      selectedSauce,
      selectedCheese,
      ...selectedVeggies,
    ];

    if (pizzaType === "nonveg" && selectedMeat) {
      allItems.push(selectedMeat);
    }

    return allItems.map((item) => ({
      itemId: item._id,
      name: item.name,
      category: item.category,
      price: item.price,
    }));
  };

  const payNow = async () => {
    if (!selectedBase || !selectedSauce || !selectedCheese) {
      alert("Please select base, sauce, and cheese");
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

    const totalPrice = calculateTotal();

    try {
      const { data } = await API.post("/orders/create-razorpay-order", {
        amount: totalPrice,
      });

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Pizza Builder",
        description: "Custom Pizza Order",
        order_id: data.orderId,

        handler: async function (response) {
          await API.post("/orders/place-order", {
            items: prepareItems(),
            totalPrice,
            deliveryAddress,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
          });

          alert("Payment successful! Order placed.");
          window.location.href = "/my-orders";
        },

        prefill: {
          name: userInfo?.user?.name,
          email: userInfo?.user?.email,
        },

        theme: {
          color: "#dc3545",
        },
      };

      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.open();
    } catch (error) {
      alert(error.response?.data?.message || "Payment failed");
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <h3>Loading pizza options...</h3>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4">🍕 Build Your Custom Pizza</h2>

      <div className="row">
        <div className="col-md-8">
          <SelectionSection
            title="1. Choose Pizza Base"
            items={bases}
            selectedItem={selectedBase}
            onSelect={setSelectedBase}
          />

          <SelectionSection
            title="2. Choose Sauce"
            items={sauces}
            selectedItem={selectedSauce}
            onSelect={setSelectedSauce}
          />

          <SelectionSection
            title="3. Choose Cheese"
            items={cheeses}
            selectedItem={selectedCheese}
            onSelect={setSelectedCheese}
          />

          <VeggieSection
            title="4. Choose Veggies"
            items={veggies}
            selectedItems={selectedVeggies}
            onToggle={toggleVeggie}
          />

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h4>Pizza Type</h4>

              <button
                className={
                  pizzaType === "veg"
                    ? "btn btn-success me-2"
                    : "btn btn-outline-success me-2"
                }
                onClick={() => {
                  setPizzaType("veg");
                  setSelectedMeat(null);
                }}
              >
                Veg
              </button>

              <button
                className={
                  pizzaType === "nonveg"
                    ? "btn btn-danger"
                    : "btn btn-outline-danger"
                }
                onClick={() => setPizzaType("nonveg")}
              >
                Non-Veg
              </button>
            </div>
          </div>

          {pizzaType === "nonveg" && (
            <SelectionSection
              title="5. Choose Meat"
              items={meats}
              selectedItem={selectedMeat}
              onSelect={setSelectedMeat}
              optional={true}
            />
          )}
        </div>

        <div className="col-md-4">
          <div className="card shadow sticky-top" style={{ top: "80px" }}>
            <div className="card-body">
              <h4>Your Pizza</h4>
              <hr />

              <p>
                <strong>Base:</strong> {selectedBase?.name || "Not selected"}
              </p>

              <p>
                <strong>Sauce:</strong> {selectedSauce?.name || "Not selected"}
              </p>

              <p>
                <strong>Cheese:</strong>{" "}
                {selectedCheese?.name || "Not selected"}
              </p>

              <p>
                <strong>Veggies:</strong>{" "}
                {selectedVeggies.length > 0
                  ? selectedVeggies.map((v) => v.name).join(", ")
                  : "None"}
              </p>

              {pizzaType === "nonveg" && (
                <p>
                  <strong>Meat:</strong> {selectedMeat?.name || "None"}
                </p>
              )}

              <hr />

              <h4>Total: ₹{calculateTotal()}</h4>

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

function SelectionSection({ title, items, selectedItem, onSelect, optional }) {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h4>{title}</h4>

        {optional && (
          <button
            className="btn btn-outline-secondary btn-sm mb-3"
            onClick={() => onSelect(null)}
          >
            No Meat
          </button>
        )}

        <div className="row">
          {items.map((item) => (
            <div className="col-md-4 mb-3" key={item._id}>
              <div
                className={
                  selectedItem?._id === item._id
                    ? "card border-danger border-3 h-100 pizza-card"
                    : "card h-100 pizza-card"
                }
                style={{ cursor: "pointer" }}
                onClick={() => onSelect(item)}
              >
                <div className="card-body text-center">
                  <img
                    src={getItemImage(item)}
                    alt={item.name}
                    className="item-image"
                  />

                  <h5>{item.name}</h5>
                  <p>Stock: {item.stock}</p>
                  <p className="fw-bold">₹{item.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && <p>No items available</p>}
      </div>
    </div>
  );
}

function VeggieSection({ title, items, selectedItems, onToggle }) {
  const isSelected = (item) => {
    return selectedItems.find((selected) => selected._id === item._id);
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h4>{title}</h4>

        <div className="row">
          {items.map((item) => (
            <div className="col-md-4 mb-3" key={item._id}>
              <div
                className={
                  isSelected(item)
                    ? "card border-success border-3 h-100 pizza-card"
                    : "card h-100 pizza-card"
                }
                style={{ cursor: "pointer" }}
                onClick={() => onToggle(item)}
              >
                <div className="card-body text-center">
                  <img
                    src={getItemImage(item)}
                    alt={item.name}
                    className="item-image"
                  />

                  <h5>{item.name}</h5>
                  <p>Stock: {item.stock}</p>
                  <p className="fw-bold">₹{item.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && <p>No veggies available</p>}
      </div>
    </div>
  );
}

export default BuildPizza;