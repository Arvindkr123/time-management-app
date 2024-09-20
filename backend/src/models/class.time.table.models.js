import mongoose from "mongoose";

const classTimeTableSchema = new mongoose.Schema(
  {
    teacherName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherTimeTable",
    },
    subjectName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubjectTimeTable",
      required: true,
    },
    ClassName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassTimeTable",
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
