import axios from "axios";

const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_BASE_URL;

export const addSubjectApiPostCall = (data) => {
  return axios.post(`${BACKEND_BASE_URL}/api/timetable/subject`, data);
};

export const getAllSubjectsApiGetCall = async (
  page,
  limit = 10,
  search = ""
) => {
  const res = await axios.get(`${BACKEND_BASE_URL}/api/timetable/subject`, {
    params: {
      page,
      limit,
      search, // Add the search parameter
    },
  });
  return res.data;
};

export const deleteSingleSubjectDataByApiDeleteCall = async (subjectId) => {
  const res = await axios.delete(
    `${BACKEND_BASE_URL}/api/timetable/subject/${subjectId}`
  );
  return res.data;
};

export const updateSingleSubjectDataByApiDeleteCall = async (
  updatedSubject
) => {
  const { id, SubjectName } = updatedSubject;
  const res = await axios.put(
    `${BACKEND_BASE_URL}/api/timetable/subject/${id}`,
    {
      SubjectName,
    }
  );
  return res.data;
};
