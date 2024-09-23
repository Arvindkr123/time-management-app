import ClassTimeTableModel from "../models/class.time.table.models.js";

/* eslint-disable no-unused-vars */
export const addClassTimeTableController = async (req, res) => {
  try {
    // Validate required fields
    if (
      !req.body.teacherName ||
      !req.body.subjectName ||
      !req.body.classDay ||
      !req.body.classTime ||
      !req.body.sectionName
    ) {
      return res.status(400).json({
        message:
          "Please fill all fields like teacherName, subjectName, classDay, and classTime",
      });
    }

    // Extract data from request body
    const {
      teacherName,
      subjectName,
      ClassName,
      classDay,
      classTime,
      sectionName,
    } = req.body;

    // Find the existing timetable for the teacher
    let classTimeTable = await ClassTimeTableModel.findOne({
      ClassName: {
        $or: {
          ClassName,
          sectionName,
        },
      },
    });

    if (!classTimeTable) {
      // If no timetable exists for the teacher, create a new one
      classTimeTable = new ClassTimeTableModel({
        ClassName,
        sectionName,
        classSchedules: [
          {
            classDay,
            schedule: [{ classTime, subjectName, teacherName }],
          },
        ],
      });
    } else {
      // If a timetable exists, check if the day already has a schedule
      const existingDay = classTimeTable.classSchedules.find(
        (schedule) => schedule.classDay === classDay
      );

      if (existingDay) {
        // If the day already exists, add a new class time to that day's schedule
        existingDay.schedule.push({ classTime, subjectName, teacherName });
      } else {
        // If the day does not exist, add a new day with the class schedule
        classTimeTable.classSchedules.push({
          classDay,
          schedule: [{ classTime, subjectName, teacherName }],
        });
      }
    }

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

export const getAddClassTimeTableControllers = async (req, res) => {
  try {
    const { search = "" } = req.query;
    // console.log(search);
    const searchFilter = search
      ? {
          ClassName: { $regex: search.split("-")[0], $options: "i" },
          sectionName: { $regex: search.split("-")[1], $options: "i" },
        } // Case-insensitive search
      : {};
    const classTimeTablesData = await ClassTimeTableModel.findOne(searchFilter);
    // console.log(classTimeTablesData);
    // console.log(classTimeTablesData);
    res.status(200).json(classTimeTablesData);
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};
