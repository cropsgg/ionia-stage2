import { Subject } from "../models/subject.model.js";
import { Class } from "../models/class.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

/**
 * @desc    Create a new subject
 * @route   POST /api/v1/subjects
 * @access  Private (SchoolAdmin)
 */
export const createSubject = async (req, res, next) => {
  try {
    const { name, subjectCode, description, associatedGradeLevels } = req.body;
    
    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Subject name is required",
      });
    }
    
    // Check if subject with same name already exists in this school
    const existingSubject = await Subject.findOne({ name, schoolId });
    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: "A subject with this name already exists in your school",
      });
    }
    
    // If subject code provided, check if it's unique in this school
    if (subjectCode) {
      const existingCode = await Subject.findOne({ subjectCode, schoolId });
      if (existingCode) {
        return res.status(400).json({
          success: false,
          message: "A subject with this code already exists in your school",
        });
      }
    }
    
    // Create new subject
    const newSubject = await Subject.create({
      name,
      schoolId,
      subjectCode: subjectCode || null,
      description: description || "",
      associatedGradeLevels: associatedGradeLevels || [],
      isActive: true,
    });
    
    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data: { subject: newSubject },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all subjects for a school
 * @route   GET /api/v1/subjects
 * @access  Private (SchoolAdmin, Teacher)
 */
export const getAllSubjects = async (req, res, next) => {
  try {
    const { active, search, gradeLevel } = req.query;
    
    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;
    
    // Build query
    const query = { schoolId };
    
    // Filter by active status if provided
    if (active !== undefined) {
      query.isActive = active === "true";
    }
    
    // Filter by grade level if provided
    if (gradeLevel) {
      query.associatedGradeLevels = gradeLevel;
    }
    
    // Add search if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { subjectCode: { $regex: search, $options: "i" } },
      ];
    }
    
    // Find subjects
    const subjects = await Subject.find(query).sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: subjects.length,
      data: { subjects },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single subject by ID
 * @route   GET /api/v1/subjects/:subjectId
 * @access  Private (SchoolAdmin, Teacher)
 */
export const getSubjectById = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    
    // Validate subjectId
    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID",
      });
    }
    
    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;
    
    // Find subject
    const subject = await Subject.findOne({ _id: subjectId, schoolId });
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }
    
    // Get classes that have this subject
    const classes = await Class.find({
      schoolId,
      subjects: subjectId,
    }).select("name yearOrGradeLevel");
    
    // Get teachers who teach this subject
    const teachers = await User.find({
      schoolId,
      role: { $in: ["teacher", "classTeacher"] },
      "assignedClasses.subjectIds": subjectId,
    }).select("fullName email username");
    
    res.status(200).json({
      success: true,
      data: {
        subject,
        classes,
        teachers,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a subject
 * @route   PUT /api/v1/subjects/:subjectId
 * @access  Private (SchoolAdmin)
 */
export const updateSubject = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const { name, subjectCode, description, associatedGradeLevels, isActive } = req.body;
    
    // Validate subjectId
    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID",
      });
    }
    
    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;
    
    // Find subject
    const subjectToUpdate = await Subject.findOne({ _id: subjectId, schoolId });
    
    if (!subjectToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }
    
    // Check if updating name and if new name already exists
    if (name && name !== subjectToUpdate.name) {
      const existingSubject = await Subject.findOne({ name, schoolId, _id: { $ne: subjectId } });
      if (existingSubject) {
        return res.status(400).json({
          success: false,
          message: "A subject with this name already exists in your school",
        });
      }
      subjectToUpdate.name = name;
    }
    
    // Check if updating code and if new code already exists
    if (subjectCode && subjectCode !== subjectToUpdate.subjectCode) {
      const existingCode = await Subject.findOne({ subjectCode, schoolId, _id: { $ne: subjectId } });
      if (existingCode) {
        return res.status(400).json({
          success: false,
          message: "A subject with this code already exists in your school",
        });
      }
      subjectToUpdate.subjectCode = subjectCode;
    }
    
    // Update other fields if provided
    if (description !== undefined) subjectToUpdate.description = description;
    if (associatedGradeLevels !== undefined) subjectToUpdate.associatedGradeLevels = associatedGradeLevels;
    if (isActive !== undefined) subjectToUpdate.isActive = isActive;
    
    // Save updated subject
    await subjectToUpdate.save();
    
    res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      data: { subject: subjectToUpdate },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a subject
 * @route   DELETE /api/v1/subjects/:subjectId
 * @access  Private (SchoolAdmin)
 */
export const deleteSubject = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    
    // Validate subjectId
    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID",
      });
    }
    
    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;
    
    // Check if the subject is being used in any classes
    const classesUsingSubject = await Class.countDocuments({
      schoolId,
      subjects: subjectId,
    });
    
    if (classesUsingSubject > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete subject as it is being used in one or more classes",
      });
    }
    
    // Check if any teachers are assigned to this subject
    const teachersAssigned = await User.countDocuments({
      schoolId,
      "assignedClasses.subjectIds": subjectId,
    });
    
    if (teachersAssigned > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete subject as it is assigned to one or more teachers",
      });
    }
    
    // Find and delete subject
    const subjectToDelete = await Subject.findOneAndDelete({ _id: subjectId, schoolId });
    
    if (!subjectToDelete) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}; 