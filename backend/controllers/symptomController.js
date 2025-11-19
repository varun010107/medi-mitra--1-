// Simple rule-based symptom checker (demo only – NOT medical advice)
export const checkSymptoms = async (req, res) => {
  const { age, symptomText } = req.body;

  if (!symptomText) {
    return res.status(400).json({ message: 'Please provide symptoms to check.' });
  }

  const text = symptomText.toLowerCase();

  const possibleConditions = [];
  const homeCare = [];
  const suggestedLabTests = [];

  if (text.includes('fever') || text.includes('temperature')) {
    possibleConditions.push('Viral infection (e.g., common cold, flu)');
    homeCare.push('Stay hydrated, take rest, and monitor temperature regularly.');
    suggestedLabTests.push('CBC (Complete Blood Count)');
  }

  if (text.includes('cough') || text.includes('cold')) {
    possibleConditions.push('Upper respiratory tract infection');
    homeCare.push('Warm fluids, steam inhalation, and salt-water gargles.');
  }

  if (text.includes('chest pain')) {
    possibleConditions.push('Possible cardiac or muscular issue – needs urgent evaluation.');
    suggestedLabTests.push('ECG');
    suggestedLabTests.push('Cardiac Enzymes (as advised by doctor)');
  }

  if (text.includes('headache')) {
    possibleConditions.push('Tension headache or migraine');
    homeCare.push('Adequate sleep, hydration, and reducing screen time may help.');
  }

  if (possibleConditions.length === 0) {
    possibleConditions.push('No clear pattern detected – please consult a doctor for proper evaluation.');
  }

  res.json({
    message: 'This is NOT a diagnosis. For medical advice, consult a professional.',
    age,
    input: symptomText,
    possibleConditions,
    homeCare,
    suggestedLabTests
  });
};
