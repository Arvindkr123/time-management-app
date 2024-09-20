/* eslint-disable no-unused-vars */
import ClassTableModel from "../models/TimeTableClass.models.js";

export const addTimeTableClassController = async (req, res) => {
  try {
    const { ClassName } = req.body;

    // Check if ClassName is present and not just an empty string/whitespace
    if (!ClassName || ClassName.trim() === "") {
      return res
        .status(400) // Use 400 for bad request instead of 401 (which is for authentication errors)
        .json({ success: false, message: "ClassName is required!" });
    }

    const existedClassName = await ClassTableModel.findOne({ ClassName });

    if (existedClassName) {
      return res
        .status(400)
        .json({ success: false, message: "class Name already exists" });
    }

    // Create a new class instance
    const newClass = new ClassTableModel({ ClassName });

    // Save the class using async/await
    await newClass.save();

    // Return a success response
    return res.status(201).json({
      success: true,
      message: "Class added successfully",
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

export const getAllTimeTableClassController = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    // Create a filter based on the search query
    const searchFilter = search
      ? { ClassName: { $regex: search, $options: "i" } } // Case-insensitive search
      : {};

    // Calculate skip and limit for pagination
    const skip = (page - 1) * limit;

    // Find and paginate the classes
    const classess = await ClassTableModel.find(searchFilter)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination info
    const totalClasses = await ClassTableModel.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalClasses / limit);

    res.status(200).json({
      success: true,
      data: classess,
      totalPages,
      totalClasses,
      currentPage: page,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error while getting classes" });
  }
};

export const deleteSingleClassTimeTableController = async (req, res) => {
  try {
    const singleClassData = await ClassTableModel.findById(req.params.id);
    if (!singleClassData) {
      return res.status(404).json({
        success: false,
        message: "Single class data not found",
      });
    }

    await singleClassData.deleteOne();

    res.status(200).json({
      success: true,
      message: "deleted single class name successfully!",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error while getting classes" });
  }
};

export const updateSingleClassTimeTableController = async (req, res) => {
  try {
    const singleClassData = await ClassTableModel.findById(req.params.id);
    if (!singleClassData) {
      return res.status(404).json({
        success: false,
        message: "Single class data not found",
      });
    }

    singleClassData.ClassName = req.body.ClassName || singleClassData.ClassName;
    await singleClassData.save();

    res.status(200).json({
      success: true,
      message: "updated single class name successfully!",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error while getting classes" });
  }
};

export const getAllClassofTimeTableController = async (req, res) => {
  try {
    const allClassData = await ClassTableModel.find();
    res.status(200).json(allClassData);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error while getting classes" });
  }
};
