import mongoose, { Schema } from "mongoose";

const permissionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    scope: {
      type: String,
      enum: ["global", "school", "class", "subject"],
      default: "global",
    },
  },
  {
    timestamps: true,
  }
);

const rolePermissionSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["admin", "user", "superadmin", "LEGACY_USER", "SCHOOL_STUDENT", "JEE_STUDENT", "TEACHER", "CLASS_TEACHER", "SCHOOL_ADMIN"],
      index: true,
    },
    permission: {
      type: String,
      required: true,
      ref: "Permission",
    },
    // For school-specific permissions
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "School",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index
rolePermissionSchema.index({ role: 1, permission: 1, schoolId: 1 }, { unique: true });

export const Permission = mongoose.model("Permission", permissionSchema);
export const RolePermission = mongoose.model("RolePermission", rolePermissionSchema); 