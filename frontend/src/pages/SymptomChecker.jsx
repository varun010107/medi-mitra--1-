import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:7001/api/symptoms';

const SymptomChecker = () => {
  const [age, setAge] = useState('');
  const [symptomText, setSymptomText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ age, symptomText })
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || 'Failed to check symptoms.');
      }
    } catch (err) {
      setError('Network error while checking symptoms.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-card">

        {/* Page Title */}
        <h2>🌡️ Symptom Checker</h2>
        <p className="page-tagline">
          Enter your symptoms to receive a basic non-diagnostic assessment, home care tips,  
          and suggested lab tests.
        </p>

        {/* FORM CARD */}
        <form onSubmit={handleSubmit} className="feature-card" style={{ marginTop: '1.5rem' }}>
          <h3>Describe Your Symptoms</h3>

          <label>Your Age (optional):</label>
          <input
            type="number"
            value={age}
            onChange={e => setAge(Number(e.target.value))}
            placeholder="e.g., 25"
          />

          <label>Your Symptoms:</label>
          <textarea
            rows="4"
            value={symptomText}
            onChange={e => setSymptomText(e.target.value)}
            placeholder="Example: Fever, cough, body pain since 2 days..."
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Checking..." : "Check Symptoms"}
          </button>
        </form>

        {/* ERRORS */}
        {error && (
          <p style={{ color: 'var(--danger-color)', marginTop: '1rem' }}>
            ⚠️ {error}
          </p>
        )}

        {/* RESULT SECTION */}
        {result && (
          <div className="feature-card" style={{ marginTop: '2rem' }}>

            <h3>🩺 Possible Conditions (Not a Diagnosis)</h3>
            <ul>
              {result.possibleConditions.map((cond, i) => (
                <li key={i}>• {cond}</li>
              ))}
            </ul>

            {result.homeCare?.length > 0 && (
              <>
                <h3 style={{ marginTop: '1.5rem' }}>🏡 Home Care Suggestions</h3>
                <ul>
                  {result.homeCare.map((care, i) => (
                    <li key={i}>• {care}</li>
                  ))}
                </ul>
              </>
            )}

            {result.suggestedLabTests?.length > 0 && (
              <>
                <h3 style={{ marginTop: '1.5rem' }}>🔬 Suggested Lab Tests</h3>
                <ul>
                  {result.suggestedLabTests.map((test, i) => (
                    <li key={i}>• {test}</li>
                  ))}
                </ul>
              </>
            )}

            <div className="disclaimer" style={{ marginTop: '1.5rem' }}>
              ⚠️ This tool is NOT a diagnosis.  
              If symptoms worsen, persist, or feel severe — consult a doctor immediately.
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker;
