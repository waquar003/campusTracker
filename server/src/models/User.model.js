import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedule',
    },
    academicGoals: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicGoal',
    },
  },
  { timeStamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, name: this.name },
    process.env.JWT_SECRET
  );
};

export const User = mongoose.model('User', userSchema);
