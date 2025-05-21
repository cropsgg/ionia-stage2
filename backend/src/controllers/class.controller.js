import { Class } from "../models/class.model.js";
import { User } from "../models/user.model.js";
import { Subject } from "../models/subject.model.js";
import mongoose from "mongoose";

/**
 * @desc    Create a new class
 * @route   POST /api/v1/classes
 * @access  Private (SchoolAdmin)
 */
export const createClass = async (req, res, next) => {
  try {
    const { name, yearOrGradeLevel, subjects = [] } = req.body;
    
    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Class name is required",
      });
    }
    
    // Check if class with same name already exists in this school
    const existingClass = await Class.findOne({ name, schoolId });
    if (existingClass) {
      return res.status(400).json({
        success: false,
        message: "A class with this name already exists in your school",
      });
    }
    
    // Create new class
    const newClass = await Class.create({
      name,
      schoolId,
      yearOrGradeLevel,
      isActive: true,
    });
    
    // If subjects are provided, add them to the class
    if (subjects.length > 0) {
      // Check if all subjects exist and belong to the school
      const validSubjects = await Subject.find({
        _id: { $in: subjects },
        schoolId,
      });
      
      if (validSubjects.length !== subjects.length) {
        return res.status(400).json({
          success: false,
          message: "One or more subjects are invalid or don't belong to your school",
        });
      }
      
      // Add subjects to class
      newClass.subjects = validSubjects.map(subject => subject._id);
      await newClass.save();
    }
    
    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: { class: newClass },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all classes for a school
 * @route   GET /api/v1/classes
 * @access  Private (SchoolAdmin, Teacher)
 */
export const getAllClasses = async (req, res, next) => {
  try {
    const { active, search, yearOrGradeLevel } = req.query;
    
    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;
    
    // Build query
    const query = { schoolId };
    
    // Filter by active status if provided
    if (active !== undefined) {
      query.isActive = active === "true";
    }
    
    // Filter by yearOrGradeLevel if provided
    if (yearOrGradeLevel) {
      query.yearOrGradeLevel = yearOrGradeLevel;
    }
    
    // Add search if provided
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    
    // Find classes
    const classes = await Class.find(query)
      .populate("classTeacherId", "fullName email username")
      .populate("subjects", "name subjectCode")
      .sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: classes.length,
      data: { classes },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single class by ID
 * @route   GET /api/v1/classes/:classId
 * @access  Private (SchoolAdmin, Teacher, ClassTeacher)
 */
export const getClassById = async (req, res, next) => {
  try {
    const { classId } = req.params;
    
    // Validate classId
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID",
      });
    }
    
    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;
    
    // Find class with detailed population
    const classDetails = await Class.findOne({ _id: classId, schoolId })
      .populate("classTeacherId", "fullName email username avatar")
      .populate("subjects", "name subjectCode description")
      .populate({
        path: "teachers.userId",
        select: "fullName email username avatar",
      })
      .populate({
        path: "teachers.subjectIds",
        select: "name subjectCode",
      })
      .populate({
        path: "students",
        select: "fullName email username avatar",
      });
    
    if (!classDetails) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }
    
    res.status(200).json({
      success: true,
      data: { class: classDetails },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a class
 * @route   PUT /api/v1/classes/:classId
 * @access  Private (SchoolAdmin)
 */
export const updateClass = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { name, yearOrGradeLevel, isActive } = req.body;
    
    // Validate classId
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID",
      });
    }
    
    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;
    
    // Find class
    const classToUpdate = await Class.findOne({ _id: classId, schoolId });
    
    if (!classToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }
    
    // Check if updating name and if new name already exists
    if (name && name !== classToUpdate.name) {
      const existingClass = await Class.findOne({ name, schoolId });
      if (existingClass) {
        return res.status(400).json({
          success: false,
          message: "A class with this name already exists in your school",
        });
      }
      classToUpdate.name = name;
    }
    
    // Update other fields if provided
    if (yearOrGradeLevel !== undefined) classToUpdate.yearOrGradeLevel = yearOrGradeLevel;
    if (isActive !== undefined) classToUpdate.isActive = isActive;
    
    // Save updated class
    await classToUpdate.save();
    
    res.status(200).json({
      success: true,
      message: "Class updated successfully",
      data: { class: classToUpdate },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a class
 * @route   DELETE /api/v1/classes/:classId
 * @access  Private (SchoolAdmin)
 */
export const deleteClass = async (req, res, next) => {
  try {
    const { classId } = req.params;
    
    // Validate classId
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID",
      });
    }
    
    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;
    
    // Find and delete class
    const classToDelete = await Class.findOneAndDelete({ _id: classId, schoolId });
    
    if (!classToDelete) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }
    
    // Clean up references to this class
    // 1. Remove class from teacher assignedClasses
    await User.updateMany(
      { "assignedClasses.classId": classId },
      { $pull: { assignedClasses: { classId } } }
    );
    
    // 2. Remove class from student enrolledClasses
    await User.updateMany(
      { enrolledClasses: classId },
      { $pull: { enrolledClasses: classId } }
    );
    
    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign subjects to a class
 * @route   POST /api/v1/classes/:classId/subjects
 * @access  Private (SchoolAdmin)
 */
export const assignSubjectsToClass = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { subjectIds } = req.body;
    
    // Validate classId
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID",
      });
    }
    
    // Validate subjectIds
    if (!subjectIds || !Array.isArray(subjectIds) || subjectIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Subject IDs array is required",
      });
    }
    
    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;
    
    // Find class
    const classToUpdate = await Class.findOne({ _id: classId, schoolId });
    
    if (!classToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }
    
    // Validate that all subjects exist and belong to the school
    const validSubjects = await Subject.find({
      _id: { $in: subjectIds },
      schoolId,
    });
    
    if (validSubjects.length !== subjectIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more subjects are invalid or don't belong to your school",
      });
    }
    
    // Update class subjects
    classToUpdate.subjects = subjectIds;
    await classToUpdate.save();
    
    // Populate subjects for response
    await classToUpdate.populate("subjects", "name subjectCode");
    
    res.status(200).json({
      success: true,
      message: "Subjects assigned to class successfully",
      data: { 
        class: classToUpdate,
        subjects: classToUpdate.subjects 
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign a class teacher to a class
 * @route   POST /api/v1/classes/:classId/class-teacher
 * @access  Private (SchoolAdmin)
 */
export const assignClassTeacher = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { teacherId } = req.body;
    
    // Validate classId and teacherId
    if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID or teacher ID",
      });
    }
    
    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;
    
    // Find class
    const classToUpdate = await Class.findOne({ _id: classId, schoolId });
    
    if (!classToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }
    
    // Find teacher and verify role and school
    const teacher = await User.findOne({
      _id: teacherId,
      schoolId,
      role: { $in: ['teacher', 'classTeacher'] },
      isActive: true
    });
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found or not eligible to be a class teacher",
      });
    }
    
    // Update teacher's role to classTeacher if not already
    if (teacher.role !== 'classTeacher') {
      teacher.role = 'classTeacher';
      await teacher.save();
    }
    
    // Update class with new class teacher
    classToUpdate.classTeacherId = teacherId;
    await classToUpdate.save();
    
    // Populate class teacher for response
    await classToUpdate.populate("classTeacherId", "fullName email username");
    
    res.status(200).json({
      success: true,
      message: "Class teacher assigned successfully",
      data: { 
        class: classToUpdate,
        classTeacher: classToUpdate.classTeacherId 
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign teachers to subjects in a class
 * @route   POST /api/v1/classes/:classId/teachers
 * @access  Private (SchoolAdmin)
 */
export const assignTeachersToClass = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { teacherAssignments } = req.body;
    
    // Validate classId
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID",
      });
    }
    
    // Validate teacherAssignments
    if (!teacherAssignments || !Array.isArray(teacherAssignments) || teacherAssignments.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Teacher assignments array is required",
      });
    }
    
    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;
    
    // Find class
    const classToUpdate = await Class.findOne({ _id: classId, schoolId });
    
    if (!classToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }
    
    // Validate subjects belong to the class
    const classSubjects = classToUpdate.subjects.map(s => s.toString());
    const allSubjectsValid = teacherAssignments.every(assignment => {
      return assignment.subjectIds.every(subjectId => 
        classSubjects.includes(subjectId)
      );
    });
    
    if (!allSubjectsValid) {
      return res.status(400).json({
        success: false,
        message: "One or more subjects are not associated with this class",
      });
    }
    
    // Validate teachers exist and belong to school
    const teacherIds = teacherAssignments.map(a => a.userId);
    const validTeachers = await User.find({
      _id: { $in: teacherIds },
      schoolId,
      role: { $in: ['teacher', 'classTeacher'] },
      isActive: true
    });
    
    if (validTeachers.length !== new Set(teacherIds).size) {
      return res.status(400).json({
        success: false,
        message: "One or more teachers are invalid or don't belong to your school",
      });
    }
    
    // Update class teachers
    classToUpdate.teachers = teacherAssignments;
    await classToUpdate.save();
    
    // Update each teacher's assignedClasses
    for (const assignment of teacherAssignments) {
      await User.updateOne(
        { _id: assignment.userId },
        { 
          $pull: { assignedClasses: { classId } } 
        }
      );
      
      await User.updateOne(
        { _id: assignment.userId },
        { 
          $push: { 
            assignedClasses: { 
              classId, 
              subjectIds: assignment.subjectIds 
            } 
          } 
        }
      );
    }
    
    // Populate for response
    await classToUpdate.populate({
      path: "teachers.userId",
      select: "fullName email username"
    });
    
    await classToUpdate.populate({
      path: "teachers.subjectIds",
      select: "name subjectCode"
    });
    
    res.status(200).json({
      success: true,
      message: "Teachers assigned to class successfully",
      data: { class: classToUpdate },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Enroll students in a class
 * @route   POST /api/v1/classes/:classId/students
 * @access  Private (SchoolAdmin, ClassTeacher)
 */
export const enrollStudentsInClass = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { studentIds } = req.body;
    
    // Validate classId
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID",
      });
    }
    
    // Validate studentIds
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Student IDs array is required",
      });
    }
    
    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;
    
    // Find class
    const classToUpdate = await Class.findOne({ _id: classId, schoolId });
    
    if (!classToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }
    
    // If ClassTeacher, verify they are the class teacher for this class
    if (req.user.role === 'classTeacher' && 
        classToUpdate.classTeacherId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to enroll students in this class",
      });
    }
    
    // Validate students exist and belong to school
    const validStudents = await User.find({
      _id: { $in: studentIds },
      schoolId,
      role: 'student',
      isActive: true
    });
    
    if (validStudents.length !== studentIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more students are invalid or don't belong to your school",
      });
    }
    
    // Get existing student IDs to avoid duplicates
    const existingStudentIds = classToUpdate.students.map(s => s.toString());
    
    // Filter out students already in class
    const newStudentIds = studentIds.filter(id => !existingStudentIds.includes(id));
    
    if (newStudentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All students are already enrolled in this class",
      });
    }
    
    // Update class with new students
    classToUpdate.students.push(...newStudentIds);
    await classToUpdate.save();
    
    // Update each student's enrolledClasses
    await User.updateMany(
      { _id: { $in: newStudentIds } },
      { $addToSet: { enrolledClasses: classId } }
    );
    
    // Populate for response
    await classToUpdate.populate({
      path: "students",
      select: "fullName email username",
    });
    
    res.status(200).json({
      success: true,
      message: "Students enrolled in class successfully",
      data: { 
        class: classToUpdate,
        students: classToUpdate.students 
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove students from a class
 * @route   DELETE /api/v1/classes/:classId/students
 * @access  Private (SchoolAdmin, ClassTeacher)
 */
export const removeStudentsFromClass = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { studentIds } = req.body;
    
    // Validate classId
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID",
      });
    }
    
    // Validate studentIds
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Student IDs array is required",
      });
    }
    
    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;
    
    // Find class
    const classToUpdate = await Class.findOne({ _id: classId, schoolId });
    
    if (!classToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }
    
    // If ClassTeacher, verify they are the class teacher for this class
    if (req.user.role === 'classTeacher' && 
        classToUpdate.classTeacherId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to remove students from this class",
      });
    }
    
    // Remove students from class
    classToUpdate.students = classToUpdate.students.filter(
      studentId => !studentIds.includes(studentId.toString())
    );
    await classToUpdate.save();
    
    // Update student enrolledClasses
    await User.updateMany(
      { _id: { $in: studentIds } },
      { $pull: { enrolledClasses: classId } }
    );
    
    res.status(200).json({
      success: true,
      message: "Students removed from class successfully",
      data: { class: classToUpdate },
    });
  } catch (error) {
    next(error);
  }
}; 