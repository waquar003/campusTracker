import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  topic: { type: String, required: true },
  startTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  participants: { type: Number },
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
    nextSession: {
      type: Date,
      default: function () {
        return this.studySessions?.[0]?.startTime;
      },
    },
    studySessions: [{ type: studySessionSchema }],
  },
  {
    timestamps: true,
  }
);

studyGroupSchema.pre('save', function (next) {
  if (this.studySessions && this.studySessions.length > 0) {
    this.nextSession = this.studySessions[0].startTime;
  }
  next();
});

export const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);
