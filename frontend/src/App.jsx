
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import DietFitness from './pages/DietFitness.jsx';
import SymptomChecker from './pages/SymptomChecker.jsx';
import LabTests from './pages/LabTests.jsx';
import DoctorAppointments from './pages/DoctorAppointments.jsx';
import Signup from './pages/Signup.jsx';

const Navigation = () => {
  return (
    <nav>
      <h1>Medi Mitra 🏥</h1>
      <div>
        <Link to="/">Home</Link>
        <Link to="/diet">Diet &amp; Fitness</Link>
        <Link to="/symptoms">Symptom Checker</Link>
        <Link to="/labs">Lab Tests</Link>
        <Link to="/doctors">Appointments</Link>
      </div>
    <Link to="/signup">Signup</Link>
</nav>
  );
};

function App() {
  return (
    <Router>
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diet" element={<DietFitness />} />
          <Route path="/symptoms" element={<SymptomChecker />} />
          <Route path="/labs" element={<LabTests />} />
          <Route path="/labs/:id" element={<LabTests />} />
          <Route path="/doctors" element={<DoctorAppointments />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
