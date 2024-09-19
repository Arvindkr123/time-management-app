import mongoose from "mongoose";

const classTimeTableSchema = new mongoose.Schema(
  {
    ClassName: {
      type: String,
      required: [true, "Class name is required"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add an index for better performance on ClassName
classTimeTableSchema.index({ ClassName: 1 });

const ClassTableModel = mongoose.model("ClassTimeTable", classTimeTableSchema);

export default ClassTableModel;
