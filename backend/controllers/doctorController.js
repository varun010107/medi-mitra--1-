import Doctor from '../models/Doctor.js';

export const getDoctors = async (req, res) => {
  try {
    const { speciality, city, mode } = req.query;
    const filter = {};

    if (speciality) filter.speciality = new RegExp(speciality, 'i');
    if (city) filter.locationCity = new RegExp(city, 'i');
    if (mode) filter.consultationMode = mode;

    const doctors = await Doctor.find(filter);
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching doctors.' });
  }
};
