import mongoose from "mongoose";

const classTimeTableSchema = new mongoose.Schema(
  {
    ClassName: {
      type: String,
    },
    sectionName: {
      type: String,
      required: true,
    },
    classSchedules: [
      {
        classDay: {
          type: String,
          required: true,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ], // to restrict the values for days
        },
        schedule: [
          {
            classTime: { type: String, required: true }, // stores time like "10:00 AM"
            subjectName: {
              type: String,
              required: true,
            },
            teacherName: {
              type: String,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const ClassTimeTableModel = mongoose.model(
  "AddClassTimeTable",
  classTimeTableSchema
);

export default ClassTimeTableModel;
