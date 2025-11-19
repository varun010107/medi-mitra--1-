import mongoose from 'mongoose';

const LabTestSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  shortDescription: { type: String, required: true },
  typicalUse: { type: String, required: true },
  preparationNote: { type: String, required: true }
});

const LabTest = mongoose.model('LabTest', LabTestSchema);
export default LabTest;
