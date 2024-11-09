import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  description: { type: String },
  startTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxParticipants: { type: Number, required: true },
  meetingLink: { type: String, required: true },
});

const studyGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    maxMembers: { type: Number, default: 8 },
    level: { type: Number, default: 1 },
    tags: [{ type: String }],
    studySessions: [studySessionSchema],
  },
  {
    timestamps: true,
  }
);

export const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);
