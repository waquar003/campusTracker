import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    profilePicture: String,
    level: { type: Number, default: 1 },
    auraPoints: { type: Number, default: 0 },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    studyGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudyGroup' }],
    academicGoals: [
      {
        title: String,
        description: String,
        deadline: Date,
        completed: { type: Boolean, default: false },
      },
    ],
  },
  { timeStamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export const User = mongoose.model('User', userSchema);