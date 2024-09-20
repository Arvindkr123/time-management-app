/* eslint-disable no-unused-vars */

import SubjectTableModel from "../models/TimeTableSubject.models.js";

export const addTimeTableSubjectController = async (req, res) => {
  try {
    const { SubjectName } = req.body;

    // Check if SubjectName is present and not just an empty string/whitespace
    if (!SubjectName || SubjectName.trim() === "") {
      return res
        .status(400) // Use 400 for bad request instead of 401 (which is for authentication errors)
        .json({ success: false, message: "Subject name is required!" });
    }

    const existedSubjectName = await SubjectTableModel.findOne({ SubjectName });

    if (existedSubjectName) {
      return res
        .status(400)
        .json({ success: false, message: "subject Name already exists" });
    }

    // Create a new class instance
    const newClass = new SubjectTableModel({ SubjectName });

    // Save the class using async/await
    await newClass.save();

    // Return a success response
    return res.status(201).json({
      success: true,
      message: "Subject added successfully",
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

export const getAllTimeTableSubjectController = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    // Create a filter based on the search query
    const searchFilter = search
      ? { SubjectName: { $regex: search, $options: "i" } } // Case-insensitive search
      : {};

    // Calculate skip and limit for pagination
    const skip = (page - 1) * limit;

    // Find and paginate the classes
    const classess = await SubjectTableModel.find(searchFilter)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination info
    const totalSubjects = await SubjectTableModel.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalSubjects / limit);

    res.status(200).json({
      success: true,
      data: classess,
      totalPages,
      totalSubjects,
      currentPage: page,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error while getting subjects" });
  }
};

export const deleteSingleSubjectTimeTableController = async (req, res) => {
  try {
    const singleSubjectData = await SubjectTableModel.findById(req.params.id);
    if (!singleSubjectData) {
      return res.status(404).json({
        success: false,
        message: "Single subjects data not found",
      });
    }

    await singleSubjectData.deleteOne();

    res.status(200).json({
      success: true,
      message: "deleted single subjects name successfully!",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error while deleting subjects" });
  }
};

export const updateSingleSubjectTimeTableController = async (req, res) => {
  try {
    const singleSubjectData = await SubjectTableModel.findById(req.params.id);
    if (!singleSubjectData) {
      return res.status(404).json({
        success: false,
        message: "Single subject data not found",
      });
    }

    singleSubjectData.SubjectName =
      req.body.SubjectName || singleSubjectData.SubjectName;
    await singleSubjectData.save();

    res.status(200).json({
      success: true,
      message: "updated single subject name successfully!",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error while updating teachers" });
  }
};

export const getAllSubjectsOfTimeTableDataController = async (req, res) => {
  try {
    const subjectsData = await SubjectTableModel.find();
    res.status(200).json(subjectsData);
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};
