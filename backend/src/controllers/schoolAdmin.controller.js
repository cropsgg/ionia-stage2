import { User } from "../models/user.model.js";
import { Class } from "../models/class.model.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

/**
 * @desc    Create a new user in the school
 * @route   POST /api/v1/school-admin/users
 * @access  Private (SchoolAdmin)
 */
export const createUser = async (req, res, next) => {
  try {
    const { fullName, email, username, password, role } = req.body;
    
    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;
    
    // Validate required fields
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, password, and role are required",
      });
    }
    
    // Validate role
    const allowedRoles = ["student", "teacher", "classTeacher"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Role must be one of: student, teacher, classTeacher",
      });
    }
    
    // Check if user with same email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }
    
    // Check if user with same username already exists (if provided)
    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: "User with this username already exists",
        });
      }
    }
    
    // Create the user
    const newUser = await User.create({
      fullName,
      email,
      username: username || email.split("@")[0],
      password,
      role,
      schoolId,
      isActive: true,
      isEmailVerified: true, // Auto-verify users created by school admin
    });
    
    // Remove sensitive information from response
    const userResponse = newUser.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;
    
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { user: userResponse },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users in the school
 * @route   GET /api/v1/school-admin/users
 * @access  Private (SchoolAdmin)
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, active, page = 1, limit = 20 } = req.query;
    
    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;
    
    // Build query
    const query = { schoolId };
    
    // Filter by role if provided
    if (role) {
      query.role = role;
    }
    
    // Filter by active status if provided
    if (active !== undefined) {
      query.isActive = active === "true";
    }
    
    // Add search if provided
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ];
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Find users
    const users = await User.find(query)
      .select("-password -refreshToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single user by ID
 * @route   GET /api/v1/school-admin/users/:userId
 * @access  Private (SchoolAdmin)
 */
export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }
    
    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;
    
    // Find user
    const user = await User.findOne({ _id: userId, schoolId })
      .select("-password -refreshToken");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    // Get additional information based on role
    let additionalInfo = {};
    
    if (user.role === "student") {
      // For students, get their enrolled classes
      const classes = await Class.find({
        _id: { $in: user.enrolledClasses },
        schoolId,
      }).select("name yearOrGradeLevel");
      
      additionalInfo.enrolledClasses = classes;
    } else if (user.role === "teacher" || user.role === "classTeacher") {
      // For teachers, get classes they teach
      const assignedClassIds = user.assignedClasses.map(ac => ac.classId);
      
      const classes = await Class.find({
        _id: { $in: assignedClassIds },
        schoolId,
      }).select("name yearOrGradeLevel");
      
      // Map classes with subjects
      const classesWithSubjects = classes.map(cls => {
        const assignment = user.assignedClasses.find(
          ac => ac.classId.toString() === cls._id.toString()
        );
        
        return {
          _id: cls._id,
          name: cls.name,
          yearOrGradeLevel: cls.yearOrGradeLevel,
          subjectIds: assignment ? assignment.subjectIds : [],
        };
      });
      
      additionalInfo.assignedClasses = classesWithSubjects;
      
      // For class teachers, also get the class they are class teacher for
      if (user.role === "classTeacher") {
        const classTeacherFor = await Class.findOne({
          classTeacherId: userId,
          schoolId,
        }).select("name yearOrGradeLevel");
        
        additionalInfo.classTeacherFor = classTeacherFor;
      }
    }
    
    res.status(200).json({
      success: true,
      data: {
        user,
        ...additionalInfo,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a user
 * @route   PUT /api/v1/school-admin/users/:userId
 * @access  Private (SchoolAdmin)
 */
export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { fullName, email, username, role, isActive } = req.body;
    
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }
    
    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;
    
    // Find user
    const userToUpdate = await User.findOne({ _id: userId, schoolId });
    
    if (!userToUpdate) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    // Check email uniqueness if updating email
    if (email && email !== userToUpdate.email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }
      userToUpdate.email = email;
    }
    
    // Check username uniqueness if updating username
    if (username && username !== userToUpdate.username) {
      const existingUsername = await User.findOne({ username, _id: { $ne: userId } });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: "User with this username already exists",
        });
      }
      userToUpdate.username = username;
    }
    
    // Update other fields if provided
    if (fullName) userToUpdate.fullName = fullName;
    
    // Handle role changes
    if (role && role !== userToUpdate.role) {
      // Validate role
      const allowedRoles = ["student", "teacher", "classTeacher"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role. Role must be one of: student, teacher, classTeacher",
        });
      }
      
      // Special handling for role changes
      if (userToUpdate.role === "classTeacher" && role !== "classTeacher") {
        // Check if the user is a class teacher for any class
        const classTeacherFor = await Class.findOne({
          classTeacherId: userId,
          schoolId,
        });
        
        if (classTeacherFor) {
          return res.status(400).json({
            success: false,
            message: "Cannot change role. User is currently assigned as a class teacher",
          });
        }
      }
      
      // Update role
      userToUpdate.role = role;
    }
    
    // Update active status if provided
    if (isActive !== undefined) {
      userToUpdate.isActive = isActive;
    }
    
    // Save updated user
    await userToUpdate.save();
    
    // Remove sensitive information from response
    const userResponse = userToUpdate.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;
    
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: { user: userResponse },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset user password
 * @route   POST /api/v1/school-admin/users/:userId/reset-password
 * @access  Private (SchoolAdmin)
 */
export const resetUserPassword = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;
    
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }
    
    // Validate new password
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long",
      });
    }
    
    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;
    
    // Find user
    const user = await User.findOne({ _id: userId, schoolId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    // Update password
    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "User password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Import multiple users
 * @route   POST /api/v1/school-admin/users/import
 * @access  Private (SchoolAdmin)
 */
export const importUsers = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    
    const { users, defaultPassword } = req.body;
    
    // Validate input
    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Users array is required and must not be empty",
      });
    }
    
    if (!defaultPassword || defaultPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Default password must be at least 8 characters long",
      });
    }
    
    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;
    
    // Collect emails and usernames for duplicate check
    const emails = users.map(user => user.email);
    const usernames = users.filter(user => user.username).map(user => user.username);
    
    // Check for duplicates in import data
    const duplicateEmails = emails.filter((email, index) => emails.indexOf(email) !== index);
    if (duplicateEmails.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Duplicate emails found in import data: ${duplicateEmails.join(", ")}`,
      });
    }
    
    const duplicateUsernames = usernames.filter((username, index) => usernames.indexOf(username) !== index);
    if (duplicateUsernames.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Duplicate usernames found in import data: ${duplicateUsernames.join(", ")}`,
      });
    }
    
    // Check for existing emails in database
    const existingEmailUsers = await User.find({ email: { $in: emails } }).select("email");
    if (existingEmailUsers.length > 0) {
      const existingEmails = existingEmailUsers.map(user => user.email);
      return res.status(400).json({
        success: false,
        message: `Following emails already exist: ${existingEmails.join(", ")}`,
      });
    }
    
    // Check for existing usernames in database
    if (usernames.length > 0) {
      const existingUsernameUsers = await User.find({ username: { $in: usernames } }).select("username");
      if (existingUsernameUsers.length > 0) {
        const existingUsernames = existingUsernameUsers.map(user => user.username);
        return res.status(400).json({
          success: false,
          message: `Following usernames already exist: ${existingUsernames.join(", ")}`,
        });
      }
    }
    
    // Create users
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    const usersToCreate = users.map(user => ({
      fullName: user.fullName,
      email: user.email,
      username: user.username || user.email.split("@")[0],
      password: hashedPassword, // Pre-hash the password since we're creating many users
      role: user.role,
      schoolId,
      isActive: true,
      isEmailVerified: true,
    }));
    
    const createdUsers = await User.insertMany(usersToCreate, { session });
    
    await session.commitTransaction();
    
    res.status(201).json({
      success: true,
      message: `Successfully imported ${createdUsers.length} users`,
      data: {
        count: createdUsers.length,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
}; 