// src/pages/DoctorAppointments.jsx
import React, { useEffect, useState } from "react";

const API_DOCTORS_URL = "http://localhost:7001/api/doctors";
const API_APPOINTMENTS_URL = "http://localhost:7001/api/appointments";
const DEMO_USER_ID = "66914560a80479d4648e3d09";

const DoctorAppointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState({ speciality: "", city: "", mode: "" });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState({
    patientName: "",
    patientAge: "",
    patientContact: "",
    appointmentDate: "",
    appointmentTimeSlot: "",
  });
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fetchDoctors = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.speciality) params.append("speciality", filter.speciality);
      if (filter.city) params.append("city", filter.city);
      if (filter.mode) params.append("mode", filter.mode);

      const res = await fetch(`${API_DOCTORS_URL}?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setDoctors(data);
      } else {
        setError(data.message || "Error fetching doctors.");
      }
    } catch (err) {
      setError("Network error while fetching doctors.");
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_APPOINTMENTS_URL}/user/${DEMO_USER_ID}`);
      const data = await res.json();
      if (res.ok) {
        setAppointments(data);
      } else {
        setError(data.message || "Error fetching appointments.");
      }
    } catch (err) {
      setError("Network error while fetching appointments.");
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilter = () => {
    fetchDoctors();
  };

  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setAppointmentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) {
      setError("Please select a doctor first.");
      return;
    }

    setError(null);
    setMessage(null);

    try {
      const res = await fetch(API_APPOINTMENTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          doctorId: selectedDoctor._id,
          ...appointmentForm,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Appointment booked successfully!");
        setAppointmentForm({
          patientName: "",
          patientAge: "",
          patientContact: "",
          appointmentDate: "",
          appointmentTimeSlot: "",
        });
        fetchAppointments();
      } else {
        setError(data.message || "Error booking appointment.");
      }
    } catch (err) {
      setError("Network error while booking appointment.");
    }
  };

  return (
    <div className="page">
      <div className="page-card">
        <h2>👩‍⚕️ Doctor Appointments</h2>
        <p className="page-tagline">
          Find doctors by speciality, city and consultation mode, then book an
          appointment in just a few clicks.
        </p>

        {error && (
          <p style={{ color: "var(--danger-color)", marginTop: "0.5rem" }}>
            Error: {error}
          </p>
        )}
        {message && (
          <p style={{ color: "var(--success-color)", marginTop: "0.5rem" }}>
            {message}
          </p>
        )}

        {/* TOP: Filters + Doctors list in 2-column layout */}
        <div className="doctor-layout">
          {/* LEFT: Filters */}
          <div className="feature-card">
            <h3>Filter Doctors</h3>

            <label>Speciality:</label>
            <input
              name="speciality"
              value={filter.speciality}
              onChange={handleFilterChange}
              placeholder="e.g., Cardiologist"
            />

            <label>City:</label>
            <input
              name="city"
              value={filter.city}
              onChange={handleFilterChange}
              placeholder="e.g., Mumbai"
            />

            <label>Consultation Mode:</label>
            <select name="mode" value={filter.mode} onChange={handleFilterChange}>
              <option value="">Any</option>
              <option value="Online">Online</option>
              <option value="In-person">In-person</option>
              <option value="Both">Both</option>
            </select>

            <button onClick={handleApplyFilter}>Apply Filter</button>
          </div>

          {/* RIGHT: Doctors List */}
          <div className="feature-card doctor-list-card">
            <h3>Available Doctors</h3>

            {doctors.length === 0 ? (
              <p>No doctors found. Try adjusting the filter.</p>
            ) : (
              <div className="doctor-list-scroll">
                {doctors.map((doc) => {
                  const isSelected =
                    selectedDoctor && selectedDoctor._id === doc._id;
                  return (
                    <div
                      key={doc._id}
                      className={`doctor-card ${isSelected ? "doctor-card-selected" : ""}`}
                      onClick={() => setSelectedDoctor(doc)}
                    >
                      <h4>{doc.name}</h4>
                      <p>
                        <strong>{doc.speciality}</strong>
                      </p>
                      <p>
                        {doc.locationCity} • {doc.consultationMode}
                      </p>
                      <p style={{ fontSize: "0.85rem", color: "#555" }}>
                        Slots: {doc.availableSlots.join(", ")}
                      </p>
                      <button
                        type="button"
                        className="small-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoctor(doc);
                        }}
                      >
                        Book Appointment
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* BOOKING FORM */}
        {selectedDoctor && (
          <div className="feature-card" style={{ marginTop: "2rem" }}>
            <h3>Book Appointment with {selectedDoctor.name}</h3>
            <p>
              <strong>Speciality:</strong> {selectedDoctor.speciality}
            </p>
            <p>
              <strong>City:</strong> {selectedDoctor.locationCity}
            </p>
            <p>
              <strong>Available Slots:</strong>{" "}
              {selectedDoctor.availableSlots.join(", ")}
            </p>

            <form onSubmit={handleBookAppointment} className="doctor-form">
              <div className="doctor-form-row">
                <div>
                  <label>Patient Name:</label>
                  <input
                    name="patientName"
                    value={appointmentForm.patientName}
                    onChange={handleAppointmentChange}
                    required
                  />
                </div>
                <div>
                  <label>Patient Age:</label>
                  <input
                    type="number"
                    name="patientAge"
                    value={appointmentForm.patientAge}
                    onChange={handleAppointmentChange}
                    required
                  />
                </div>
              </div>

              <div className="doctor-form-row">
                <div>
                  <label>Patient Contact:</label>
                  <input
                    name="patientContact"
                    value={appointmentForm.patientContact}
                    onChange={handleAppointmentChange}
                    required
                  />
                </div>
                <div>
                  <label>Appointment Date:</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={appointmentForm.appointmentDate}
                    onChange={handleAppointmentChange}
                    required
                  />
                </div>
              </div>

              <div className="doctor-form-row">
                <div>
                  <label>Time Slot:</label>
                  <select
                    name="appointmentTimeSlot"
                    value={appointmentForm.appointmentTimeSlot}
                    onChange={handleAppointmentChange}
                    required
                  >
                    <option value="">Select Slot</option>
                    {selectedDoctor.availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit">Book Appointment</button>
            </form>
          </div>
        )}

        {/* UPCOMING APPOINTMENTS */}
        <div className="feature-card" style={{ marginTop: "2rem" }}>
          <h3>Your Upcoming Appointments</h3>
          {appointments.length === 0 ? (
            <p>No appointments booked yet.</p>
          ) : (
            <ul className="appointments-list">
              {appointments.map((appt) => (
                <li key={appt._id}>
                  <strong>{appt.appointmentDate.slice(0, 10)}</strong> –{" "}
                  {appt.appointmentTimeSlot} with {appt.doctor?.name} (
                  {appt.doctor?.speciality}) • Status: {appt.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
