import express from "express";
import { PORT } from "./src/config/config.js";
import cors from "cors";
import classRoutes from "./src/routes/class.routes.js";
import teacherRoutes from "./src/routes/teacher.routes.js";
import subjectRoutes from "./src/routes/subject.routes.js";
import userRoutes from "./src/routes/users.routes.js";
import connectDB from "./src/config/connectDb.config.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", userRoutes);
app.use("/api/timetable/class", classRoutes);
app.use("/api/timetable/teacher", teacherRoutes);
app.use("/api/timetable/subject", subjectRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server listening on http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    console.log("Error connecting to database");
  });
