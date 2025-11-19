import LabTest from '../models/LabTest.js';

export const getAllLabTests = async (req, res) => {
  try {
    const tests = await LabTest.find({});
    res.json(tests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching lab tests.' });
  }
};

export const getLabTestById = async (req, res) => {
  try {
    const test = await LabTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Lab test not found.' });
    }
    res.json(test);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching lab test.' });
  }
};
