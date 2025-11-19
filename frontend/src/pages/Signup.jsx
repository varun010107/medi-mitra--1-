import React, { useState } from "react";

const API_SIGNUP_URL = "http://localhost:7001/api/users/signup";

const Signup = () => {
  const [form, setForm] = useState({ name: "", age: "", contact: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    try {
      const res = await fetch(API_SIGNUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          age: Number(form.age),
          contact: form.contact,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: data.message || "Signup successful!" });
        setForm({ name: "", age: "", contact: "" });
      } else {
        setStatus({ type: "error", message: data.message || "Error during signup." });
      }
    } catch (error) {
      console.error("Signup error:", error);
      setStatus({ type: "error", message: "Network error. Please try again." });
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "2rem",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2>Signup</h2>
      <p>Fill your basic details to get started with Medi Mitra.</p>

      {status && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem 1rem",
            borderRadius: "4px",
            backgroundColor:
              status.type === "success" ? "var(--success-color)" : "var(--danger-color)",
            color: "white",
          }}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="age">Age</label>
          <input
            id="age"
            name="age"
            type="number"
            min="0"
            value={form.age}
            onChange={handleChange}
            placeholder="Enter your age"
            required
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="contact">Contact Info</label>
          <input
            id="contact"
            name="contact"
            type="text"
            value={form.contact}
            onChange={handleChange}
            placeholder="Phone number or email"
            required
          />
        </div>

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default Signup;
