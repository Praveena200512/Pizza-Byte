import { useEffect, useState } from "react";
import API from "../services/api";

const getItemIcon = (item) => {
  const name = item.name.toLowerCase();

  if (name.includes("thin")) return "🥖";
  if (name.includes("cheese burst")) return "🧀";
  if (name.includes("wheat")) return "🌾";
  if (name.includes("pan")) return "🍳";
  if (name.includes("stuffed")) return "🥐";

  if (name.includes("tomato")) return "🍅";
  if (name.includes("barbeque")) return "🔥";
  if (name.includes("pesto")) return "🌿";
  if (name.includes("alfredo")) return "🥛";
  if (name.includes("garlic")) return "🧄";

  if (name.includes("mozzarella")) return "🧀";
  if (name.includes("cheddar")) return "🟡";
  if (name.includes("parmesan")) return "🧀";

  if (name.includes("onion")) return "🧅";
  if (name.includes("capsicum")) return "🫑";
  if (name.includes("corn")) return "🌽";
  if (name.includes("olive")) return "🫒";
  if (name.includes("jalapeno")) return "🌶️";
  if (name.includes("mushroom")) return "🍄";

  if (name.includes("chicken")) return "🍗";
  if (name.includes("pepperoni")) return "🥩";

  return "🍕";
};

function BuildPizza() {
  const [bases, setBases] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [cheeses, setCheeses] = useState([]);
  const [veggies, setVeggies] = useState([]);
  const [meats, setMeats] = useState([]);

  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedCheese, setSelectedCheese] = useState(null);
  const [selectedVeggies, setSelectedVeggies] = useState([]);
  const [selectedMeat, setSelectedMeat] = useState(null);

  const [loading, setLoading] = useState(true);

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
    if (selectedMeat) total += selectedMeat.price;

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
      ...selectedVeggies
    ];

    if (selectedMeat) {
      allItems.push(selectedMeat);
    }

    return allItems.map((item) => ({
      itemId: item._id,
      name: item.name,
      category: item.category,
      price: item.price
    }));
  };

  const payNow = async () => {
    if (!selectedBase || !selectedSauce || !selectedCheese) {
      alert("Please select base, sauce, and cheese");
      return;
    }

    const totalPrice = calculateTotal();

    try {
      const { data } = await API.post("/orders/create-razorpay-order", {
        amount: totalPrice
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
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id
          });

          alert("Payment successful! Order placed.");
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

          <SelectionSection
            title="5. Choose Meat Optional"
            items={meats}
            selectedItem={selectedMeat}
            onSelect={setSelectedMeat}
            optional={true}
          />
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
                <strong>Cheese:</strong> {selectedCheese?.name || "Not selected"}
              </p>
              <p>
                <strong>Veggies:</strong>{" "}
                {selectedVeggies.length > 0
                  ? selectedVeggies.map((v) => v.name).join(", ")
                  : "None"}
              </p>
              <p>
                <strong>Meat:</strong> {selectedMeat?.name || "None"}
              </p>

              <hr />

              <h4>Total: ₹{calculateTotal()}</h4>

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
                  <div className="item-icon">{getItemIcon(item)}</div>
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
                  <div className="item-icon">{getItemIcon(item)}</div>
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