import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignments: [
    {
      id: { type: String, required: true },
      title: { type: String, required: true },
      course: { type: String, required: true },
      dueDate: { type: Date, required: true },
      status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'completed', 'overdue'],
      },
      description: String,
      priority: String,
      auraPoints: { type: Number, default: 0 },
    },
  ],
});

export const Assignment = mongoose.model('Assignment', assignmentSchema);
