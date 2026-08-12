import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for this event.'],
      maxlength: [100, 'Title cannot be more than 100 characters.']
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for this event.']
    },
    date: {
      type: String, // format: YYYY-MM-DD
      required: [true, 'Please provide a date for this event.']
    },
    time: {
      type: String, // format: HH:MM AM/PM
      required: [true, 'Please provide a time for this event.']
    },
    venue: {
      type: String,
      required: [true, 'Please provide a venue for this event.']
    },
    category: {
      type: String,
      required: [true, 'Please provide a category for this event.'],
      enum: ['Workshop', 'Hackathon', 'Bootcamp', 'Competition', 'Talk', 'Seminar', 'Cultural', 'Sports', 'Conference', 'Other']
    },
    bannerImage: {
      type: String, // Stored as Base64 encoded string
      required: [true, 'Please upload a banner image.']
    },
    registrationLink: {
      type: String,
      required: [true, 'Please provide a registration link.']
    },
    status: {
      type: String,
      required: [true, 'Please specify status.'],
      enum: ['Upcoming', 'Completed', 'Draft'],
      default: 'Upcoming'
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
