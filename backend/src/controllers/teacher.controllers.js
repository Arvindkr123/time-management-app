/* eslint-disable no-unused-vars */

import TeacherTableModel from "../models/TimeTableTeacher.models.js";

export const addTimeTableTeacherController = async (req, res) => {
  try {
    console.log(req.body);
    const { TeacherName } = req.body;

    // Check if TeacherName is present and not just an empty string/whitespace
    if (!TeacherName || TeacherName.trim() === "") {
      return res
        .status(400) // Use 400 for bad request instead of 401 (which is for authentication errors)
        .json({ success: false, message: "Teacher name is required!" });
    }

    const existedTeacherName = await TeacherTableModel.findOne({ TeacherName });

    if (existedTeacherName) {
      return res
        .status(400)
        .json({ success: false, message: "teacher Name already exists" });
    }

    // Create a new class instance
    const newClass = new TeacherTableModel({ TeacherName });

    // Save the class using async/await
    await newClass.save();

    // Return a success response
    return res.status(201).json({
      success: true,
      message: "Teacher added successfully",
    });
  } catch (error) {
    // Handle any server errors
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getAllTimeTableTeacherController = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    // Create a filter based on the search query
    const searchFilter = search
      ? { TeacherName: { $regex: search, $options: "i" } } // Case-insensitive search
      : {};

    // Calculate skip and limit for pagination
    const skip = (page - 1) * limit;

    // Find and paginate the classes
    const classess = await TeacherTableModel.find(searchFilter)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination info
    const totalTeachers = await TeacherTableModel.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalTeachers / limit);

    res.status(200).json({
      success: true,
      data: classess,
      totalPages,
      totalTeachers,
      currentPage: page,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error while getting teachers" });
  }
};

export const deleteSingleTeacherTimeTableController = async (req, res) => {
  try {
    const singleTeacherData = await TeacherTableModel.findById(req.params.id);
    if (!singleTeacherData) {
      return res.status(404).json({
        success: false,
        message: "Single teacher data not found",
      });
    }

    await singleTeacherData.deleteOne();

    res.status(200).json({
      success: true,
      message: "deleted single teacher name successfully!",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error while deleting teachers" });
  }
};

export const updateSingleTeacherTimeTableController = async (req, res) => {
  try {
    const singleTeacherData = await TeacherTableModel.findById(req.params.id);
    if (!singleTeacherData) {
      return res.status(404).json({
        success: false,
        message: "Single teacher data not found",
      });
    }

    singleTeacherData.TeacherName =
      req.body.TeacherName || singleTeacherData.TeacherName;
    await singleTeacherData.save();

    res.status(200).json({
      success: true,
      message: "updated single teacher name successfully!",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error while updating teachers" });
  }
};
