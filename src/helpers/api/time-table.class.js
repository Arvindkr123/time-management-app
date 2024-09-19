import axios from "axios";

const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_BASE_URL;

export const addClassApiPostCall = (data) => {
  return axios.post(`${BACKEND_BASE_URL}/api/timetable/class`, data);
};

export const getAllClassesApiGetCall = async (
  page,
  limit = 10,
  search = ""
) => {
  const res = await axios.get(`${BACKEND_BASE_URL}/api/timetable/class`, {
    params: {
      page,
      limit,
      search, // Add the search parameter
    },
  });
  return res.data;
};
