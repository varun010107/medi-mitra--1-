import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:7001/api/lab-tests";

const LabTests = () => {
  const { id } = useParams();
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchTests = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      if (res.ok) {
        setTests(data);
      } else {
        setError(data.message || "Error fetching lab tests.");
      }
    } catch (err) {
      setError("Network error while fetching lab tests.");
    }
  };

  const fetchSingleTest = async (testId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${testId}`);
      const data = await res.json();
      if (res.ok) {
        setSelectedTest(data);
      } else {
        setError(data.message || "Error fetching lab test.");
      }
    } catch (err) {
      setError("Network error while fetching lab test.");
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    if (id) {
      fetchSingleTest(id);
    }
  }, [id]);

  const filteredTests = tests.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      (t.shortDescription || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="page">
      <div className="page-card">
        <h2>🔬 Lab Tests</h2>
        <p className="page-tagline">
          Browse common lab tests, see what they are used for and how to
          prepare for them.
        </p>

        {error && (
          <p style={{ color: "var(--danger-color)", marginTop: "0.5rem" }}>
            Error: {error}
          </p>
        )}

        {/* Search bar card */}
        <div className="feature-card" style={{ marginTop: "1.5rem" }}>
          <h3>Search &amp; Explore</h3>
          <input
            type="text"
            placeholder="Search by test name, category, or purpose..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* MAIN LAYOUT: left list, right details */}
        <div className="lab-layout">
          {/* LEFT – scrollable list */}
          <div className="lab-list">
            {filteredTests.map((test) => (
              <div
                className="lab-list-item feature-card"
                key={test._id}
                onClick={() => setSelectedTest(test)}
              >
                <h4>{test.name}</h4>
                <p>
                  <strong>Category:</strong> {test.category}
                </p>
                <p>{test.shortDescription}</p>
              </div>
            ))}
            {filteredTests.length === 0 && (
              <p style={{ color: "#555" }}>No tests match your search.</p>
            )}
          </div>

          {/* RIGHT – selected test details */}
          <div className="lab-detail feature-card">
            {selectedTest ? (
              <>
                <h3>{selectedTest.name}</h3>
                <p>
                  <strong>Category:</strong> {selectedTest.category}
                </p>
                <p>{selectedTest.shortDescription}</p>
                <p>
                  <strong>Typical Use:</strong> {selectedTest.typicalUse}
                </p>
                <p>
                  <strong>Preparation:</strong> {selectedTest.preparationNote}
                </p>
              </>
            ) : (
              <p style={{ color: "#555" }}>
                Select a test from the list to see full details, typical use,
                and preparation notes.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabTests;
