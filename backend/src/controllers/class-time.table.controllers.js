import ClassTimeTableModel from "../models/class.time.table.models.js";

/* eslint-disable no-unused-vars */
export const addClassTimeTableController = async (req, res) => {
  try {
    //     {
    //     "teacherName": "66ebf7278ca3af771a91c03d",
    //     "subjectName": "66ec0a297d54c4a0146c6d86",
    //     "ClassName": "66ebbf5335f8d2b999d6f03b",
    //     "classDay": "Wednesday",
    //     "classTime": "22:00"
    // }

    if (
      req.body.subjectName === "" ||
      req.body.classDay === "" ||
      req.body.classTime === ""
    ) {
      return res.status(400).json({
        message:
          "Please fill all fields likes subjectName, Class day, and ClassTime",
      });
    }

    const newClassTimeTable = new ClassTimeTableModel(req.body);
    await newClassTimeTable.save();
    res
      .status(200)
      .json({ success: true, message: "added class time table successfully!" });
  } catch (error) {
    res
      .status(200)
      .json({ success: false, error: "Error while adding class time table" });
  }
};
