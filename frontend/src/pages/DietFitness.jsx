import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:7001/api/diet';
const DEMO_USER_ID = '66914560a80479d4648e3d09';

const DietFitness = () => {
  const [profile, setProfile] = useState({
    name: '',
    age: 30,
    gender: 'Male',
    height: 175,
    currentWeight: 70,
    activityLevel: 'Moderately Active',
    goal: 'Build muscle',
  });

  const [dietPlan, setDietPlan] = useState(null);
  const [summary, setSummary] = useState(null);
  const [customFood, setCustomFood] = useState({
    name: '',
    quantity: 1,
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    mealType: 'breakfast',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasPlan = !!dietPlan;

  // provide safe default meals so UI always renders
  const safeMeals = hasPlan
    ? dietPlan.meals
    : {
        breakfast: [],
        lunch: [],
        snacks: [],
        dinner: [],
      };

  // ---------- FETCH SUMMARY ON LOAD ----------
  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/summary/${DEMO_USER_ID}`);
      const data = await response.json();
      if (response.ok) {
        setSummary(data.summary || null);
        if (data.fullPlan) {
          setDietPlan(data.fullPlan);
        }
      } else {
        setError(data.message || 'Failed to fetch summary.');
      }
    } catch (err) {
      setError('Network error while fetching summary.');
    } finally {
      setLoading(false);
    }
  };

  // ---------- PROFILE HANDLERS ----------
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]:
        name === 'age' || name === 'height' || name === 'currentWeight'
          ? Number(value)
          : value,
    }));
  };

  const handlePlanCalculation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: DEMO_USER_ID, ...profile }),
      });
      const data = await response.json();
      if (response.ok) {
        setDietPlan(data.dietPlan);
        fetchSummary();
        alert('Diet plan and macros calculated and saved!');
      } else {
        setError(data.message || 'Failed to calculate plan.');
      }
    } catch (err) {
      setError('Network error during plan calculation.');
    } finally {
      setLoading(false);
    }
  };

  // ---------- CUSTOM FOOD HANDLERS ----------
  const handleCustomFoodChange = (e) => {
    const { name, value } = e.target;
    setCustomFood((prev) => ({
      ...prev,
      [name]:
        ['quantity', 'calories', 'protein', 'carbs', 'fats'].includes(name)
          ? Number(value)
          : value,
    }));
  };

  const handleCustomFoodSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { mealType, ...foodItem } = customFood;
      const response = await fetch(`${API_BASE_URL}/custom-food-entry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: DEMO_USER_ID, mealType, foodItem }),
      });
      const data = await response.json();
      if (response.ok) {
        setDietPlan(data.updatedDietPlan);
        fetchSummary();
        setCustomFood({
          name: '',
          quantity: 1,
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
          mealType: 'breakfast',
        });
      } else {
        setError(data.message || 'Failed to add custom food.');
      }
    } catch (err) {
      setError('Network error during custom food entry.');
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI ----------
  return (
    <div className="page">
      <div className="page-card">
        <h2>🍎 Diet &amp; Fitness Planner</h2>
        <p className="page-tagline">
          Calculate your macros, generate a daily meal plan, and log your own foods to keep
          track of calories and nutrition.
        </p>

        {loading && <p>Loading...</p>}
        {error && (
          <p style={{ color: 'var(--danger-color)' }}>
            Error: {error}
          </p>
        )}

        {/* TOP ROW: PROFILE + SUMMARY */}
        <div className="card-grid">
          <div className="feature-card">
            <h3>Your Goal &amp; Profile</h3>
            <form onSubmit={handlePlanCalculation}>
              <label>Goal:</label>
              <select
                name="goal"
                value={profile.goal}
                onChange={handleProfileChange}
                required
              >
                <option value="Lose weight">Lose weight</option>
                <option value="Build muscle">Build muscle</option>
                <option value="Gain weight">Gain weight</option>
              </select>

              <label>Age (years):</label>
              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleProfileChange}
                required
              />

              <label>Height (cm):</label>
              <input
                type="number"
                name="height"
                value={profile.height}
                onChange={handleProfileChange}
                required
              />

              <label>Weight (kg):</label>
              <input
                type="number"
                name="currentWeight"
                value={profile.currentWeight}
                onChange={handleProfileChange}
                required
              />

              <label>Activity Level:</label>
              <select
                name="activityLevel"
                value={profile.activityLevel}
                onChange={handleProfileChange}
                required
              >
                <option value="Sedentary">Sedentary</option>
                <option value="Lightly Active">Lightly Active</option>
                <option value="Moderately Active">Moderately Active</option>
                <option value="Very Active">Very Active</option>
              </select>

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: 'var(--primary-green)' }}
              >
                Calculate &amp; Get Plan
              </button>
            </form>
          </div>

          <div className="feature-card" style={{ border: '2px solid var(--primary-blue)' }}>
            <h3>Daily Summary &amp; Macros</h3>

            {hasPlan ? (
              <>
                <h4>Recommended Daily:</h4>
                <p>
                  <strong>Calories:</strong> {dietPlan.recommendedMacros.calories} kcal
                </p>
                <p>
                  <strong>Protein:</strong> {dietPlan.recommendedMacros.protein} g
                </p>
                <p>
                  <strong>Carbs:</strong> {dietPlan.recommendedMacros.carbs} g
                </p>
                <p>
                  <strong>Fats:</strong> {dietPlan.recommendedMacros.fats} g
                </p>
              </>
            ) : (
              <p style={{ color: '#555' }}>
                Click <strong>Calculate &amp; Get Plan</strong> to see your recommended daily
                macros here.
              </p>
            )}

            {summary && (
              <>
                <hr />
                <h4>Logged Today:</h4>
                <p>
                  <strong>Calories:</strong> {summary.totalCalories} kcal
                </p>
                <p>
                  <strong>Protein:</strong> {summary.totalProtein} g
                </p>
                <p>
                  <strong>Carbs:</strong> {summary.totalCarbs} g
                </p>
                <p>
                  <strong>Fats:</strong> {summary.totalFats} g
                </p>
              </>
            )}
          </div>
        </div>

        {/* ALWAYS-SHOWN MEAL PLAN ROW */}
        <div style={{ marginTop: '3rem' }}>
          <h3>
            Daily Meal Plan {hasPlan && `(${dietPlan.goal} Goal)`}
          </h3>

          <div className="meal-grid">
            {['breakfast', 'lunch', 'snacks', 'dinner'].map((mealKey) => (
              <div key={mealKey} className="feature-card">
                <h4>{mealKey.charAt(0).toUpperCase() + mealKey.slice(1)}</h4>
                {hasPlan ? (
                  safeMeals[mealKey].length === 0 ? (
                    <p>No items logged yet.</p>
                  ) : (
                    <ul>
                      {safeMeals[mealKey].map((item, index) => (
                        <li key={index}>
                          <strong>{item.name}</strong> ({item.calories} kcal,{' '}
                          {item.protein}P/{item.carbs}C/{item.fats}F)
                        </li>
                      ))}
                    </ul>
                  )
                ) : (
                  <p style={{ color: '#777' }}>
                    Calculate your plan above to see suggested foods here.
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* ALWAYS-SHOWN CUSTOM FOOD + FITNESS ROW */}
          <div className="diet-two-col" style={{ marginTop: '3rem' }}>
            {/* LEFT: Custom Food Entry */}
            <div className="feature-card">
              <h4>➕ Custom Food Entry</h4>
              <form onSubmit={handleCustomFoodSubmit} className="food-entry">
                {/* Row 1: meal type + name */}
                <div className="food-entry-row2">
                  <select
                    name="mealType"
                    value={customFood.mealType}
                    onChange={handleCustomFoodChange}
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="snacks">Snacks</option>
                    <option value="dinner">Dinner</option>
                  </select>

                  <input
                    name="name"
                    type="text"
                    placeholder="Food Name"
                    value={customFood.name}
                    onChange={handleCustomFoodChange}
                    required
                  />
                </div>

                {/* Row 2: 4 numbers */}
                <div className="food-entry-row3">
                  <input
                    name="calories"
                    type="number"
                    placeholder="Calories"
                    value={customFood.calories}
                    onChange={handleCustomFoodChange}
                    required
                  />
                  <input
                    name="protein"
                    type="number"
                    placeholder="Protein (g)"
                    value={customFood.protein}
                    onChange={handleCustomFoodChange}
                    required
                  />
                  <input
                    name="carbs"
                    type="number"
                    placeholder="Carbs (g)"
                    value={customFood.carbs}
                    onChange={handleCustomFoodChange}
                    required
                  />
                  <input
                    name="fats"
                    type="number"
                    placeholder="Fats (g)"
                    value={customFood.fats}
                    onChange={handleCustomFoodChange}
                    required
                  />
                </div>

                {/* Row 3: button below */}
                <button type="submit" className="log-btn" disabled={loading}>
                  Add to Log
                </button>
              </form>
            </div>

            {/* RIGHT: Simple Fitness Planner */}
            <div className="feature-card">
              <h3>💪 Simple Fitness Planner</h3>
              <p>Basic weekly structure you can follow:</p>
              <ul>
                <li>Workout: 3 days/week (strength or resistance)</li>
                <li>Cardio: 3–4 days/week (walking, jogging, cycling)</li>
                <li>Steps goal: 7,000–10,000 steps/day</li>
                <li>Sleep: 7–9 hours/night</li>
              </ul>
              <button type="button">
                Manage Weekly Schedule (Future Feature)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietFitness;
