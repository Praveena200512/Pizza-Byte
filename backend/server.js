const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Inventory = require("./models/Inventory");

dotenv.config();

connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://pizza-byte.vercel.app",
  "https://pizza-byte-o4rvenp8x-praveenas-projects-87f222f7.vercel.app"
];

const createReadyPizzas = async () => {
  try {
    const count = await Inventory.countDocuments({ category: "readyPizza" });

    if (count === 0) {
      await Inventory.insertMany([
        { name: "Margherita Pizza", category: "readyPizza", stock: 50, threshold: 20, price: 199 },
        { name: "Farmhouse Pizza", category: "readyPizza", stock: 50, threshold: 20, price: 249 },
        { name: "Paneer Pizza", category: "readyPizza", stock: 50, threshold: 20, price: 279 },
        { name: "Veggie Delight Pizza", category: "readyPizza", stock: 50, threshold: 20, price: 229 },
        { name: "Chicken Pizza", category: "readyPizza", stock: 50, threshold: 20, price: 299 },
        { name: "Pepperoni Pizza", category: "readyPizza", stock: 50, threshold: 20, price: 329 }
      ]);

      console.log("Ready-made pizzas created");
    }
  } catch (error) {
    console.log("Ready pizza creation error:", error.message);
  }
};

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Pizza Builder API is running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await createReadyPizzas();
});