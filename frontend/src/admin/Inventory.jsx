import { useEffect, useState } from "react";
import API from "../services/api";

function Inventory() {
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category: "base",
    stock: "",
    threshold: "",
    price: ""
  });

  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchInventory = async () => {
    try {
      const { data } = await API.get("/inventory");
      setItems(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const changeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      category: form.category,
      stock: Number(form.stock),
      threshold: Number(form.threshold),
      price: Number(form.price)
    };

    try {
      if (editId) {
        await API.put(`/inventory/${editId}`, payload);
        setMessage("Inventory item updated successfully");
      } else {
        await API.post("/inventory", payload);
        setMessage("Inventory item added successfully");
      }

      setForm({
        name: "",
        category: "base",
        stock: "",
        threshold: "",
        price: ""
      });

      setEditId(null);
      fetchInventory();
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  const editHandler = (item) => {
    setEditId(item._id);

    setForm({
      name: item.name,
      category: item.category,
      stock: item.stock,
      threshold: item.threshold,
      price: item.price
    });

    window.scrollTo(0, 0);
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await API.delete(`/inventory/${id}`);
      fetchInventory();
    }
  };

  const cancelEdit = () => {
    setEditId(null);

    setForm({
      name: "",
      category: "base",
      stock: "",
      threshold: "",
      price: ""
    });
  };

  return (
    <div className="container mt-4 mb-5">
      <h2>Admin Inventory Management</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4>{editId ? "Edit Inventory Item" : "Add Inventory Item"}</h4>

          <form onSubmit={submitHandler}>
            <div className="row">
              <div className="col-md-3 mb-3">
                <label>Name</label>
                <input
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={changeHandler}
                  required
                />
              </div>

              <div className="col-md-2 mb-3">
                <label>Category</label>
                <select
                  className="form-control"
                  name="category"
                  value={form.category}
                  onChange={changeHandler}
                >
                  <option value="base">Base</option>
                  <option value="sauce">Sauce</option>
                  <option value="cheese">Cheese</option>
                  <option value="veggie">Veggie</option>
                  <option value="meat">Meat</option>
                </select>
              </div>

              <div className="col-md-2 mb-3">
                <label>Stock</label>
                <input
                  className="form-control"
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={changeHandler}
                  required
                />
              </div>

              <div className="col-md-2 mb-3">
                <label>Threshold</label>
                <input
                  className="form-control"
                  name="threshold"
                  type="number"
                  value={form.threshold}
                  onChange={changeHandler}
                  required
                />
              </div>

              <div className="col-md-2 mb-3">
                <label>Price</label>
                <input
                  className="form-control"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={changeHandler}
                  required
                />
              </div>

              <div className="col-md-1 mb-3 d-flex align-items-end">
                <button className="btn btn-danger w-100">
                  {editId ? "Save" : "Add"}
                </button>
              </div>
            </div>

            {editId && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={cancelEdit}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h4>Inventory List</h4>

          <table className="table table-bordered table-hover mt-3">
            <thead className="table-danger">
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Threshold</th>
                <th>Price</th>
                <th>Stock Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.stock}</td>
                  <td>{item.threshold}</td>
                  <td>₹{item.price}</td>
                  <td>
                    {item.stock <= item.threshold ? (
                      <span className="badge bg-danger">Low Stock</span>
                    ) : (
                      <span className="badge bg-success">Available</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => editHandler(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteHandler(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {items.length === 0 && <p>No inventory items found.</p>}
        </div>
      </div>
    </div>
  );
}

export default Inventory;