import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "🍎 Diet & Fitness",
      description:
        "Calculate your daily macros, get a personalized diet plan, and track your fitness schedule.",
      path: "/diet",
      quickAction: "Start Planning",
    },
    {
      title: "🌡️ Symptom Detection",
      description:
        "Enter your symptoms and get a non-diagnostic assessment, home care tips, and advice.",
      path: "/symptoms",
      quickAction: "Start Check-up",
    },
    {
      title: "🔬 Lab Tests",
      description:
        "Browse, search, and filter essential lab tests with preparation details and typical uses. Book tests online.",
      path: "/labs",
      quickAction: "View Tests",
    },
    {
      title: "👩‍⚕️ Doctor Appointments",
      description:
        "Find doctors by specialty, city, and mode. View availability and book your next consultation.",
      path: "/doctors",
      quickAction: "Find a Doctor",
    },
  ];

  return (
    <div className="home-container">

      {/* 🔹 HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Your Health, Simplified.</h1>

          <p className="hero-subtitle">
            Manage diet, symptoms, lab tests and doctor appointments – all in one
            smart healthcare assistant.
          </p>

          <button className="hero-button" onClick={() => navigate("/symptoms")}>
            Start Health Check
          </button>
        </div>

        <div className="hero-image">
          <img
            src="https://www.crossplatformmobiledevelopment.net/wp-content/uploads/EHR-integration-with-healthcare-apps.jpg"
            alt="Healthcare"  className="hero-illustration rounded-soft"
          />
        </div>
      </section>

      {/* 🔹 FEATURES SECTION */}
      <section className="features-section">
        <h2 className="section-title">Our Services</h2>

        <div className="card-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <Link to={feature.path}>
                <button className="feature-button">
                  {feature.quickAction}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
