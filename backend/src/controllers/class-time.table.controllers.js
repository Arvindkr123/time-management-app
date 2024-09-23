import ClassTimeTableModel from "../models/class.time.table.models.js";

/* eslint-disable no-unused-vars */
export const addClassTimeTableController = async (req, res) => {
  try {
    // Extract data from request body
    console.log(req.body);
    const {
      teacherName,
      subjectName,
      ClassName,
      classDay,
      classTime,
      sectionName,
    } = req.body;

    if (
      !teacherName ||
      !subjectName ||
      !ClassName ||
      !classDay ||
      !classTime ||
      !sectionName
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // Find the existing timetable for the teacher
    let classTimeTable = new ClassTimeTableModel(req.body);
    // Save the updated or new class timetable
    await classTimeTable.save();

    res.status(200).json({
      success: true,
      message: "Added class time table successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Error while adding class time table",
    });
  }
};
