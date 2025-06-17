import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { School } from "../models/school.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendEmail } from "../utils/emailService.js";

/**
 * Register a new school (initial stage, not approved yet)
 * Only accessible by a super-admin
 */
const registerSchool = asyncHandler(async (req, res) => {
  // 1. Extract school details from request
  const {
    name,
    subdomain,
    principalName,
    location,
    studentCount,
    teacherCount,
    principalEmail,
    principalUsername,
    principalPassword,
    additionalDetails
  } = req.body;

  // 2. Validate required fields
  if ([name, subdomain, principalName, location, studentCount, teacherCount, principalEmail, principalUsername, principalPassword].some(field => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // 3. Check if school with same subdomain exists
  const existingSchool = await School.findOne({ subdomain: subdomain.toLowerCase() });
  if (existingSchool) {
    throw new ApiError(409, "School with this subdomain already exists");
  }

  // 4. Check if principal email/username is already in use
  const existingUser = await User.findOne({
    $or: [
      { email: principalEmail.toLowerCase() },
      { username: principalUsername.toLowerCase() }
    ]
  });
  if (existingUser) {
    throw new ApiError(409, "Principal email or username already in use");
  }

  // 5. Handle logo upload if provided
  let logoUrl = "";
  if (req.files && req.files.logo && req.files.logo.length > 0) {
    const logoLocalPath = req.files.logo[0].path;
    const uploadedLogo = await uploadOnCloudinary(logoLocalPath);
    logoUrl = uploadedLogo?.url || "";
  }

  // 6. Create principal user with SCHOOL_ADMIN role
  const principalUser = await User.create({
    fullName: principalName,
    email: principalEmail.toLowerCase(),
    username: principalUsername.toLowerCase(),
    password: principalPassword,
    role: "SCHOOL_ADMIN",
  });

  // 7. Create school document
  const school = await School.create({
    name,
    subdomain: subdomain.toLowerCase(),
    logo: logoUrl,
    principalName,
    location,
    studentCount,
    teacherCount: parseInt(teacherCount),
    principalUserId: principalUser._id,
    isApproved: false,
    isActive: true,
    additionalDetails: additionalDetails || {}
  });

  // 8. Update principal user with schoolId
  await User.findByIdAndUpdate(
    principalUser._id,
    { schoolId: school._id },
    { new: true }
  );

  // 9. Send notification email to super-admin
  try {
    await sendEmail({
      email: process.env.ADMIN_EMAIL,
      subject: "New School Registration: Approval Required",
      text: `A new school "${name}" has registered and requires your approval. Subdomain: ${subdomain}`,
      html: `
        <h1>New School Registration</h1>
        <p>A new school has registered and requires your approval.</p>
        <p><strong>School Name:</strong> ${name}</p>
        <p><strong>Subdomain:</strong> ${subdomain}</p>
        <p><strong>Principal:</strong> ${principalName}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p>Please login to the admin dashboard to review and approve.</p>
      `
    });
  } catch (error) {
    console.error("Failed to send notification email:", error);
    // Continue with registration even if email fails
  }

  // 10. Return response
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { 
          school: {
            _id: school._id,
            name: school.name,
            subdomain: school.subdomain,
            isApproved: school.isApproved
          }
        },
        "School registered successfully! Awaiting admin approval."
      )
    );
});

/**
 * Approve a school registration
 * Only accessible by super-admin
 */
const approveSchool = asyncHandler(async (req, res) => {
  const { schoolId } = req.params;

  const school = await School.findById(schoolId);
  if (!school) {
    throw new ApiError(404, "School not found");
  }

  if (school.isApproved) {
    throw new ApiError(400, "School is already approved");
  }

  // Update school status
  school.isApproved = true;
  school.approvedBy = req.user._id;
  school.approvedAt = new Date();
  await school.save();

  // Find principal user to notify
  const principal = await User.findById(school.principalUserId);
  if (principal) {
    try {
      await sendEmail({
        email: principal.email,
        subject: "School Registration Approved",
        text: `Your school "${school.name}" has been approved. You can now start using the platform.`,
        html: `
          <h1>School Registration Approved</h1>
          <p>Congratulations! Your school "${school.name}" has been approved.</p>
          <p>You can now access your school dashboard at: <a href="https://${school.subdomain}.ionia.com">https://${school.subdomain}.ionia.com</a></p>
          <p>Start setting up your classes and inviting teachers to join your school.</p>
        `
      });
    } catch (error) {
      console.error("Failed to send approval email:", error);
      // Continue with approval even if email fails
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { 
          school: {
            _id: school._id,
            name: school.name,
            subdomain: school.subdomain,
            isApproved: school.isApproved,
            approvedAt: school.approvedAt
          }
        },
        "School approved successfully"
      )
    );
});

/**
 * Get all schools (with pagination and filters)
 * Only accessible by super-admin
 */
const getAllSchools = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;

  const filter = {};
  if (status === 'approved') filter.isApproved = true;
  if (status === 'pending') filter.isApproved = false;
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { subdomain: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } }
    ];
  }

  const schools = await School.find(filter)
    .sort({ createdAt: -1 })
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit));

  const totalCount = await School.countDocuments(filter);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { 
          schools,
          pagination: {
            totalCount,
            totalPages: Math.ceil(totalCount / parseInt(limit)),
            currentPage: parseInt(page),
            limit: parseInt(limit)
          }
        },
        "Schools retrieved successfully"
      )
    );
});

/**
 * Get school details by ID or subdomain
 * Accessible by super-admin and the school's principal
 */
const getSchoolDetails = asyncHandler(async (req, res) => {
  const { identifier } = req.params; // Can be either schoolId or subdomain
  
  let school;
  
  // Check if identifier is a valid MongoDB ObjectId
  if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
    school = await School.findById(identifier);
  } else {
    // Assume it's a subdomain
    school = await School.findOne({ subdomain: identifier.toLowerCase() });
  }
  
  if (!school) {
    throw new ApiError(404, "School not found");
  }

  // Check authorization: only super-admin or the school's principal can access
  if (req.user.role !== "superadmin" && 
      (!req.user.schoolId || req.user.schoolId.toString() !== school._id.toString() || 
       req.user.role !== "SCHOOL_ADMIN")) {
    throw new ApiError(403, "You don't have permission to access this school's details");
  }

  // Get principal user details
  const principalUser = await User.findById(school.principalUserId).select("fullName email username");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { 
          school: {
            ...school.toObject(),
            principalUser
          }
        },
        "School details retrieved successfully"
      )
    );
});

/**
 * Update school details
 * Accessible by super-admin and the school's principal
 */
const updateSchool = asyncHandler(async (req, res) => {
  const { schoolId } = req.params;
  
  const school = await School.findById(schoolId);
  if (!school) {
    throw new ApiError(404, "School not found");
  }

  // Check authorization: only super-admin or the school's principal can update
  if (req.user.role !== "superadmin" && 
      (!req.user.schoolId || req.user.schoolId.toString() !== school._id.toString() || 
       req.user.role !== "SCHOOL_ADMIN")) {
    throw new ApiError(403, "You don't have permission to update this school");
  }

  // Update fields if provided
  const {
    name,
    location,
    studentCount,
    teacherCount,
    primaryColor,
    secondaryColor,
    additionalDetails
  } = req.body;

  if (name) school.name = name;
  if (location) school.location = location;
  if (studentCount) school.studentCount = studentCount;
  if (teacherCount) school.teacherCount = parseInt(teacherCount);
  if (primaryColor) school.primaryColor = primaryColor;
  if (secondaryColor) school.secondaryColor = secondaryColor;
  if (additionalDetails) school.additionalDetails = additionalDetails;

  // Handle logo update if provided
  if (req.files && req.files.logo && req.files.logo.length > 0) {
    const logoLocalPath = req.files.logo[0].path;
    const uploadedLogo = await uploadOnCloudinary(logoLocalPath);
    school.logo = uploadedLogo?.url || school.logo;
  }

  await school.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { school },
        "School updated successfully"
      )
    );
});

export {
  registerSchool,
  approveSchool,
  getAllSchools,
  getSchoolDetails,
  updateSchool
}; 