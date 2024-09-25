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
      ClassName,
      sectionName,
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
    const { ClassName, sectionName } = req.query;
    const classTimeTablesData = await ClassTimeTableModel.findOne({
      ClassName: { $regex: ClassName, $options: "i" },
      sectionName: { $regex: sectionName, $options: "i" },
    });
    //console.log(classTimeTablesData);
    // console.log(classTimeTablesData);
    res.status(200).json(classTimeTablesData);
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

export const deleteSingleClassTimeTableController = async (req, res) => {
  try {
    const { p1, ch1 } = req.params;
    //console.log(req.params);

    //Assuming ClassTimeTableModel is your Mongoose model
    const result = await ClassTimeTableModel.updateOne(
      {
        _id: p1, // Mongoose will cast this string to ObjectId automatically
        "classSchedules.schedule._id": ch1,
      },
      {
        $pull: {
          "classSchedules.$.schedule": { _id: ch1 },
        },
      }
    );

    //console.log(result);

    res.status(200).json({
      success: true,
      messgae: "deleted single class time table successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

export const updateSingleClassTimeTableController = async (req, res) => {
  try {
    const { p1, ch1 } = req.params; // p1 is the class ID, ch1 is the schedule ID
    const { classTime, subjectName, teacherName } = req.body; // Get new values from request body
    console.log(req.body);

    // Find the document and update the specific schedule entry
    const result = await ClassTimeTableModel.updateOne(
      {
        _id: p1, // Mongoose will cast this string to ObjectId automatically
        "classSchedules.schedule._id": ch1,
      },
      {
        $set: {
          "classSchedules.$.schedule.$[elem].classTime": classTime,
          "classSchedules.$.schedule.$[elem].subjectName": subjectName,
          "classSchedules.$.schedule.$[elem].teacherName": teacherName,
        },
      },
      {
        arrayFilters: [{ "elem._id": ch1 }], // Use arrayFilters to specify which item to update
      }
    );

    if (result.nModified === 0) {
      return res.status(404).json({
        success: false,
        message: "No schedule found to update",
      });
    }

    res.status(200).json({
      success: true,
      message: "Updated class time table successfully",
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};
