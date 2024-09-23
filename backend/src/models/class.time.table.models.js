import mongoose from "mongoose";

const classTimeTableSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    ClassName: {
      type: String,
      required: true,
    },
    classDay: { type: String, required: true },
    classTime: { type: String, required: true },
  },
  { timestamps: true }
);

const ClassTimeTableModel = mongoose.model(
  "AddClassTimeTable",
  classTimeTableSchema
);

export default ClassTimeTableModel;
