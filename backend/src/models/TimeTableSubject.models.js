import mongoose from "mongoose";

const subjectTimeTableSchema = new mongoose.Schema(
  {
    SubjectName: {
      type: String,
      required: [true, "Subject name is required"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add an index for better performance on SubjectName
subjectTimeTableSchema.index({ SubjectName: 1 });

const SubjectTableModel = mongoose.model(
  "SubjectTimeTable",
  subjectTimeTableSchema
);

export default SubjectTableModel;
