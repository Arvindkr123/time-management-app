import mongoose from "mongoose";

const teacherTimeTableSchema = new mongoose.Schema(
  {
    TeacherName: {
      type: String,
      required: [true, "Teacher name is required"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add an index for better performance on TeacherName
teacherTimeTableSchema.index({ TeacherName: 1 });

const TeacherTableModel = mongoose.model(
  "TeacherTimeTable",
  teacherTimeTableSchema
);

export default TeacherTableModel;
