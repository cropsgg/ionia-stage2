import mongoose, { Schema } from "mongoose";

const schoolSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    subdomain: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    logo: {
      type: String, // Cloudinary URL
    },
    primaryColor: {
      type: String,
      default: "#10b981", // Default emerald color
    },
    secondaryColor: {
      type: String,
      default: "#064e3b", // Darker emerald
    },
    principalName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    studentCount: {
      type: String, // Range like "100-500"
      required: true,
    },
    teacherCount: {
      type: Number,
      required: true,
    },
    principalUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isApproved: {
      type: Boolean,
      default: false, // Requires super-admin approval
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    additionalDetails: {
      type: Object, // For any other details
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index for subdomain and isActive
schoolSchema.index({ subdomain: 1, isActive: 1 });

export const School = mongoose.model("School", schoolSchema); 