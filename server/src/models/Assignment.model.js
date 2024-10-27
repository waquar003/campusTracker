import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  deadline: { type: Date, required: true },
  points: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
});

export const Assignment = mongoose.model('Assignment', assignmentSchema);
