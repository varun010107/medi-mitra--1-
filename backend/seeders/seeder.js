import Doctor from '../models/Doctor.js';
import LabTest from '../models/LabTest.js';

export const seedInitialData = async () => {
  try {
    const doctorCount = await Doctor.countDocuments();
    const labTestCount = await LabTest.countDocuments();

    if (doctorCount === 0) {
      await Doctor.insertMany([
        {
          name: 'Dr. Aisha Verma',
          speciality: 'General Physician',
          experience: 10,
          locationCity: 'Mumbai',
          consultationMode: 'Both',
          availableSlots: ['10:00 AM', '11:00 AM', '04:00 PM'],
          rating: 4.5
        },
        {
          name: 'Dr. Rahul Shah',
          speciality: 'Cardiologist',
          experience: 12,
          locationCity: 'Mumbai',
          consultationMode: 'In-person',
          availableSlots: ['09:30 AM', '02:00 PM'],
          rating: 4.8
        },
        {
          name: 'Dr. Meera Iyer',
          speciality: 'Dermatologist',
          experience: 8,
          locationCity: 'Bangalore',
          consultationMode: 'Online',
          availableSlots: ['01:00 PM', '03:30 PM'],
          rating: 4.4
        }
      ]);
      console.log('Seeded doctors collection.');
    }

    if (labTestCount === 0) {
      await LabTest.insertMany([
        {
          name: 'CBC (Complete Blood Count)',
          category: 'General Health',
          shortDescription: 'Measures different components of blood.',
          typicalUse: 'Detects infections, anemia, and other blood disorders.',
          preparationNote: 'No special preparation usually required.'
        },
        {
          name: 'Fasting Blood Sugar',
          category: 'Diabetes',
          shortDescription: 'Measures blood glucose levels after fasting.',
          typicalUse: 'Used to diagnose and monitor diabetes.',
          preparationNote: 'Fasting for at least 8 hours is required.'
        },
        {
          name: 'Lipid Profile',
          category: 'Cardiac Health',
          shortDescription: 'Measures cholesterol and triglyceride levels.',
          typicalUse: 'Assesses risk of heart disease.',
          preparationNote: 'Overnight fasting is recommended.'
        }
      ]);
      console.log('Seeded lab tests collection.');
    }
  } catch (error) {
    console.error('Error seeding data:', error.message);
  }
};
