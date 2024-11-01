import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    events: [
      {
        id: String,
        title: String,
        start: Date,
        end: Date,
        type: {
          type: String,
          enum: ['lecture', 'assignment', 'study', 'event'],
          required: true,
        },
        location: String,
        recurring: {
          days: [
            {
              type: String,
              enum: [
                'sunday',
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'friday',
                'saturday',
              ],
            },
          ],
          until: Date,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Schedule = mongoose.model('Schedule', scheduleSchema);
