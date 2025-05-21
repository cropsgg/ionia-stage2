import mongoose, { Schema } from "mongoose";

const schoolSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    contactInfo: {
      type: String,
      trim: true,
    },
    logoUrl: {
      type: String, // Cloudinary URL for school logo
    },
    colorTheme: {
      type: String, // Hex code or theme name within Ionia palette
      default: "#4F46E5", // Default primary color
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    initialAdminUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    policies: {
      gradingScale: {
        type: String,
        default: "A=90-100,B=80-89,C=70-79,D=60-69,F=0-59", // Default grading scale
      },
      lateSubmissionRule: {
        type: String,
        default: "Allowed with 10% penalty per day", // Default late submission rule
      },
    },
    superAdminNotes: {
      type: String,
    },
    // For future billing integration
    subscriptionTier: {
      type: String,
      default: "Basic",
    },
    subscriptionExpiresAt: {
      type: Date,
    },
    billingCustomerId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const School = mongoose.model("School", schoolSchema); 