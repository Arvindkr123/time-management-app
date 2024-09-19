import axios from "axios";

const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_BASE_URL;

export const addTeacherApiPostCall = (data) => {
  return axios.post(`${BACKEND_BASE_URL}/api/timetable/teacher`, data);
};

export const getAllTeacheresApiGetCall = async (
  page,
  limit = 10,
  search = ""
) => {
  const res = await axios.get(`${BACKEND_BASE_URL}/api/timetable/teacher`, {
    params: {
      page,
      limit,
      search, // Add the search parameter
    },
  });
  return res.data;
};

export const deleteSingleTeacherDataByApiDeleteCall = async (teacherId) => {
  const res = await axios.delete(
    `${BACKEND_BASE_URL}/api/timetable/teacher/${teacherId}`
  );
  return res.data;
};

export const updateSingleTeacherDataByApiDeleteCall = async (
  updatedTeacher
) => {
  const { id, TeacherName } = updatedTeacher;
  const res = await axios.put(
    `${BACKEND_BASE_URL}/api/timetable/teacher/${id}`,
    {
      TeacherName,
    }
  );
  return res.data;
};
