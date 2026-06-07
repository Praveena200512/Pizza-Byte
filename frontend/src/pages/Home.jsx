import { Link } from "react-router-dom";

function Home() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-md-6">
              <h1 className="hero-title">
                Build Your Own <span>Pizza</span>
              </h1>

              <p className="hero-text">
                Choose your favorite base, sauce, cheese, veggies, and toppings.
                Pay online and track your pizza from kitchen to delivery.
              </p>

              {userInfo ? (
                userInfo.user.role === "admin" ? (
                  <Link to="/admin/dashboard" className="btn btn-danger btn-lg">
                    Go to Admin Dashboard
                  </Link>
                ) : (
                  <Link to="/build-pizza" className="btn btn-danger btn-lg">
                    Start Building
                  </Link>
                )
              ) : (
                <>
                  <Link to="/register" className="btn btn-danger btn-lg me-3">
                    Get Started
                  </Link>

                  <Link to="/login" className="btn btn-outline-danger btn-lg">
                    Login
                  </Link>
                </>
              )}
            </div>

            <div className="col-md-6 text-center">
              <div className="pizza-emoji">🍕</div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section py-5">
        <div className="container">
          <h2 className="text-center mb-5">Why Choose Pizza Builder?</h2>

          <div className="row">
            <FeatureCard
              icon="🥖"
              title="Choose Base"
              text="Select from thin crust, cheese burst, pan pizza, and more."
            />

            <FeatureCard
              icon="🧀"
              title="Custom Toppings"
              text="Add sauces, cheese, veggies, and meat as per your taste."
            />

            <FeatureCard
              icon="💳"
              title="Online Payment"
              text="Pay safely using Razorpay test checkout integration."
            />

            <FeatureCard
              icon="🚚"
              title="Track Order"
              text="Track your pizza status from order received to delivery."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="col-md-3 mb-4">
      <div className="feature-card text-center">
        <div className="feature-icon">{icon}</div>
        <h5>{title}</h5>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default Home;