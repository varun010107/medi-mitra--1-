import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

export const createAppointment = async (req, res) => {
  try {
    const {
      userId,
      doctorId,
      patientName,
      patientAge,
      patientContact,
      appointmentDate,
      appointmentTimeSlot
    } = req.body;

    if (
      !userId ||
      !doctorId ||
      !patientName ||
      !patientAge ||
      !patientContact ||
      !appointmentDate ||
      !appointmentTimeSlot
    ) {
      return res.status(400).json({ message: 'Missing required appointment fields.' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    const dateOnly = new Date(appointmentDate);
    dateOnly.setHours(0, 0, 0, 0);

    const appointment = await Appointment.create({
      user: userId,
      doctor: doctorId,
      patientName,
      patientAge,
      patientContact,
      appointmentDate: dateOnly,
      appointmentTimeSlot
    });

    res.status(201).json({
      message: 'Appointment booked successfully.',
      appointment
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: 'This time slot is already booked for the selected doctor.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Error creating appointment.' });
  }
};

export const getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await Appointment.find({ user: userId })
      .populate('doctor')
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching appointments.' });
  }
};
