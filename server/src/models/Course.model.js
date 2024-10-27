import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  description: String,
  instructor: { type: String, required: true },
  schedule: [
    {
      day: String,
      startTime: String,
      endTime: String,
      location: String,
    },
  ],
  chapters: [
    {
      title: String,
      description: String,
      completed: { type: Boolean, default: false },
      auraPoints: Number,
    },
  ],
});

export const Course = mongoose.model('Course', courseSchema);
