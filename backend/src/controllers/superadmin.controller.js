import { School } from "../models/school.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { sendSchoolAdminWelcomeEmail } from "../utils/email.service.js";

/**
 * Super Admin Controller
 * Handles school creation, management, and other super-admin only operations
 */

/**
 * @desc    Create a new school
 * @route   POST /api/v1/superadmin/schools
 * @access  Private (SuperAdmin only)
 */
export const createSchool = async (req, res, next) => {
  try {
    const {
      name,
      address,
      contactInfo,
      logoUrl,
      colorTheme,
      initialAdminUsers,
      policies,
      subscriptionTier,
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "School name is required",
      });
    }

    // Create the school
    const school = await School.create({
      name,
      address,
      contactInfo,
      logoUrl,
      colorTheme,
      policies: policies || {},
      subscriptionTier: subscriptionTier || "Basic",
    });

    // Process initial admin users if provided
    const adminUserIds = [];
    if (initialAdminUsers && initialAdminUsers.length > 0) {
      // Create admin users in parallel
      const adminPromises = initialAdminUsers.map(async (adminData) => {
        // Hash password is handled by the model's pre-save hook
        const user = await User.create({
          fullName: adminData.fullName,
          email: adminData.email,
          username: adminData.username || adminData.email.split("@")[0],
          password: adminData.password,
          role: "schoolAdmin",
          schoolId: school._id,
        });
        
        return user._id;
      });
      
      const createdAdminIds = await Promise.all(adminPromises);
      adminUserIds.push(...createdAdminIds);
      
      // Update the school with initial admin users
      school.initialAdminUsers = adminUserIds;
      await school.save();
    }

    res.status(201).json({
      success: true,
      message: "School created successfully",
      data: {
        school,
        initialAdminUsers: adminUserIds,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "School with this name already exists",
      });
    }
    next(error);
  }
};

/**
 * @desc    Get all schools
 * @route   GET /api/v1/superadmin/schools
 * @access  Private (SuperAdmin only)
 */
export const getAllSchools = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, isActive } = req.query;
    
    // Build query
    const query = {};
    
    // Add search if provided
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    
    // Filter by active status if provided
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }
    
    // Count total documents
    const total = await School.countDocuments(query);
    
    // Find schools with pagination
    const schools = await School.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: {
        schools,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a school by ID
 * @route   GET /api/v1/superadmin/schools/:schoolId
 * @access  Private (SuperAdmin only)
 */
export const getSchoolById = async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    
    // Validate schoolId
    if (!mongoose.Types.ObjectId.isValid(schoolId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid school ID",
      });
    }
    
    // Find the school
    const school = await School.findById(schoolId);
    
    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }
    
    // Get admin users
    const adminUsers = await User.find({
      schoolId: school._id,
      role: "schoolAdmin",
    }).select("-password -refreshToken");
    
    res.status(200).json({
      success: true,
      data: {
        school,
        adminUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a school
 * @route   PUT /api/v1/superadmin/schools/:schoolId
 * @access  Private (SuperAdmin only)
 */
export const updateSchool = async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    const {
      name,
      address,
      contactInfo,
      logoUrl,
      colorTheme,
      policies,
      superAdminNotes,
      subscriptionTier,
      subscriptionExpiresAt,
    } = req.body;
    
    // Validate schoolId
    if (!mongoose.Types.ObjectId.isValid(schoolId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid school ID",
      });
    }
    
    // Find the school
    const school = await School.findById(schoolId);
    
    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }
    
    // Update fields
    if (name) school.name = name;
    if (address) school.address = address;
    if (contactInfo) school.contactInfo = contactInfo;
    if (logoUrl) school.logoUrl = logoUrl;
    if (colorTheme) school.colorTheme = colorTheme;
    if (policies) {
      school.policies = {
        ...school.policies,
        ...policies,
      };
    }
    if (superAdminNotes) school.superAdminNotes = superAdminNotes;
    if (subscriptionTier) school.subscriptionTier = subscriptionTier;
    if (subscriptionExpiresAt) school.subscriptionExpiresAt = subscriptionExpiresAt;
    
    // Save updated school
    await school.save();
    
    res.status(200).json({
      success: true,
      message: "School updated successfully",
      data: { school },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "School with this name already exists",
      });
    }
    next(error);
  }
};

/**
 * @desc    Update a school's active status
 * @route   PATCH /api/v1/superadmin/schools/:schoolId/status
 * @access  Private (SuperAdmin only)
 */
export const updateSchoolStatus = async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    const { isActive } = req.body;
    
    // Validate schoolId
    if (!mongoose.Types.ObjectId.isValid(schoolId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid school ID",
      });
    }
    
    // Validate isActive
    if (isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: "isActive status is required",
      });
    }
    
    // Find and update the school
    const school = await School.findByIdAndUpdate(
      schoolId,
      { isActive },
      { new: true }
    );
    
    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }
    
    res.status(200).json({
      success: true,
      message: `School ${isActive ? "activated" : "deactivated"} successfully`,
      data: { school },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new school admin
 * @route   POST /api/v1/superadmin/schools/:schoolId/admins
 * @access  Private (SuperAdmin only)
 */
export const addSchoolAdmin = async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    const { fullName, email, username, password } = req.body;
    
    // Validate schoolId
    if (!mongoose.Types.ObjectId.isValid(schoolId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid school ID",
      });
    }
    
    // Check if school exists
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }
    
    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are required",
      });
    }
    
    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }
    
    // Create the admin user
    const adminUser = await User.create({
      fullName,
      email,
      username: username || email.split("@")[0],
      password,
      role: "schoolAdmin",
      schoolId,
    });
    
    // Add user to school's initialAdminUsers if not already there
    if (!school.initialAdminUsers.includes(adminUser._id)) {
      school.initialAdminUsers.push(adminUser._id);
      await school.save();
    }
    
    // Remove password from response
    const adminUserResponse = adminUser.toObject();
    delete adminUserResponse.password;
    delete adminUserResponse.refreshToken;
    
    res.status(201).json({
      success: true,
      message: "School admin added successfully",
      data: { adminUser: adminUserResponse },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "User with this email or username already exists",
      });
    }
    next(error);
  }
}; 