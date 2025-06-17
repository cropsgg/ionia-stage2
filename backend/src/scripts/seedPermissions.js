import mongoose from "mongoose";
import dotenv from "dotenv";
import { Permission, RolePermission } from "../models/permission.model.js";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Define basic permissions
const basePermissions = [
  {
    name: "school.view",
    description: "View school details",
    scope: "school",
  },
  {
    name: "school.edit",
    description: "Edit school details",
    scope: "school",
  },
  {
    name: "class.create",
    description: "Create a new class",
    scope: "school",
  },
  {
    name: "class.view",
    description: "View class details",
    scope: "class",
  },
  {
    name: "class.edit",
    description: "Edit class details",
    scope: "class",
  },
  {
    name: "class.delete",
    description: "Delete a class",
    scope: "school",
  },
  {
    name: "subject.create",
    description: "Create a new subject",
    scope: "school",
  },
  {
    name: "subject.view",
    description: "View subject details",
    scope: "subject",
  },
  {
    name: "subject.edit",
    description: "Edit subject details",
    scope: "subject",
  },
  {
    name: "subject.delete",
    description: "Delete a subject",
    scope: "school",
  },
  {
    name: "user.create",
    description: "Create a new user",
    scope: "school",
  },
  {
    name: "user.view",
    description: "View user details",
    scope: "school",
  },
  {
    name: "user.edit",
    description: "Edit user details",
    scope: "school",
  },
  {
    name: "user.delete",
    description: "Delete a user",
    scope: "school",
  },
  {
    name: "assignment.create",
    description: "Create a new assignment",
    scope: "subject",
  },
  {
    name: "assignment.view",
    description: "View assignment details",
    scope: "subject",
  },
  {
    name: "assignment.edit",
    description: "Edit assignment details",
    scope: "subject",
  },
  {
    name: "assignment.delete",
    description: "Delete an assignment",
    scope: "subject",
  },
  {
    name: "submission.create",
    description: "Create a submission",
    scope: "subject",
  },
  {
    name: "submission.view",
    description: "View submission details",
    scope: "subject",
  },
  {
    name: "submission.grade",
    description: "Grade a submission",
    scope: "subject",
  },
];

// Define role permissions
const rolePermissions = [
  // SCHOOL_ADMIN permissions
  ...basePermissions.map(permission => ({
    role: "SCHOOL_ADMIN",
    permission: permission.name,
  })),
  
  // CLASS_TEACHER permissions
  ...[
    "class.view", "class.edit",
    "subject.view",
    "user.view",
    "assignment.view",
    "submission.view", "submission.grade",
  ].map(permission => ({
    role: "CLASS_TEACHER",
    permission,
  })),
  
  // TEACHER permissions
  ...[
    "class.view",
    "subject.view",
    "user.view",
    "assignment.create", "assignment.view", "assignment.edit", "assignment.delete",
    "submission.view", "submission.grade",
  ].map(permission => ({
    role: "TEACHER",
    permission,
  })),
  
  // SCHOOL_STUDENT permissions
  ...[
    "class.view",
    "subject.view",
    "assignment.view",
    "submission.create", "submission.view",
  ].map(permission => ({
    role: "SCHOOL_STUDENT",
    permission,
  })),
  
  // JEE_STUDENT permissions
  ...[
    "subject.view",
    "assignment.view",
    "submission.create", "submission.view",
  ].map(permission => ({
    role: "JEE_STUDENT",
    permission,
  })),
];

// Seed function
const seedPermissions = async () => {
  try {
    // Clear existing permissions
    await Permission.deleteMany({});
    await RolePermission.deleteMany({});
    
    // Create permissions
    const createdPermissions = await Permission.insertMany(basePermissions);
    console.log(`Created ${createdPermissions.length} permissions`);
    
    // Create role permissions
    const createdRolePermissions = await RolePermission.insertMany(rolePermissions);
    console.log(`Created ${createdRolePermissions.length} role permissions`);
    
    console.log("Permissions seeded successfully");
  } catch (error) {
    console.error("Error seeding permissions:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeder
seedPermissions(); 