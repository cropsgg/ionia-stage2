// backend/src/models/user.model.js

import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // Cloudinary URL
    },
    coverImage: {
      type: String, // Cloudinary URL
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
    // Reset password fields
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    // Email verification fields
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpires: {
      type: Date,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    // Role field with proper validation
    role: {
      type: String,
      enum: ["student", "teacher", "classTeacher", "schoolAdmin", "superAdmin"],
      required: true,
    },
    // School association for multi-tenancy
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: function() {
        // Only superAdmin doesn't need a schoolId
        return this.role !== 'superAdmin';
      },
      index: true, // Index for efficient queries
    },
    // Fields for teachers - keeping for Stage 2 functionality
    assignedClasses: [
      {
        classId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Class",
        },
        subjectIds: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
          },
        ],
      },
    ],
    // Fields for students - keeping for Stage 2 functionality
    enrolledClasses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
    // For class teachers - which class they are responsible for
    assignedClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: function() {
        return this.role === 'classTeacher';
      }
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient school-based queries
userSchema.index({ schoolId: 1, role: 1 });
userSchema.index({ schoolId: 1, email: 1 }, { unique: true });

// Validation to ensure email uniqueness within each school
userSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('email') || this.isModified('schoolId')) {
    // For superAdmin, check global email uniqueness
    if (this.role === 'superAdmin') {
      const existingUser = await this.constructor.findOne({ 
        email: this.email, 
        _id: { $ne: this._id } 
      });
      if (existingUser) {
        const error = new Error('Email already exists');
        error.code = 11000;
        return next(error);
      }
    } else {
      // For other roles, check email uniqueness within the school
      const existingUser = await this.constructor.findOne({ 
        email: this.email, 
        schoolId: this.schoolId,
        _id: { $ne: this._id } 
      });
      if (existingUser) {
        const error = new Error('Email already exists in this school');
        error.code = 11000;
        return next(error);
      }
    }
  }
  next();
});

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Verify password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate access token with schoolId
userSchema.methods.generateAccessToken = function () {
  const payload = {
    _id: this._id,
    email: this.email,
    username: this.username,
    fullName: this.fullName,
    role: this.role,
    schoolId: this.schoolId, // Include schoolId in token for multi-tenancy
  };

  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );

  return accessToken;
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );

  return refreshToken;
};

export const User = mongoose.model("User", userSchema);
