import axios from "axios";
const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_BASE_URL;

export const getAllClassesOfTimeTable = async () => {
  const res = await axios.get(
    `${BACKEND_BASE_URL}/api/timetable/class/all-classes`
  );
  return res.data;
};

export const getAllTeachersOfTimeTableApiCall = async () => {
  const res = await axios.get(
    `${BACKEND_BASE_URL}/api/timetable/teacher/all-teachers`
  );
  return res.data;
};

export const getAllSubjectsOfTimeTableApiCall = async () => {
  const res = await axios.get(
    `${BACKEND_BASE_URL}/api/timetable/subject/all-subjects`
  );
  return res.data;
};

export const addClassTimeTableDataApiCall = async (classTimeTableData) => {
  const res = await axios.post(
    `${BACKEND_BASE_URL}/api/addclassTimeTable`,
    classTimeTableData
  );
  return res.data;
};

export const getAllAddClassTimeTableDataApiCall = async (search = "") => {
  const res = await axios.get(`${BACKEND_BASE_URL}/api/addclassTimeTable/get`, {
    params: {
      search,
    },
  });
  return res.data;
};
