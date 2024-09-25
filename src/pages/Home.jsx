/* eslint-disable no-unused-vars */
import {
  ChevronUpDownIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Dialog,
  CardFooter,
  Select,
  Option,
  IconButton,
} from "@material-tailwind/react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  addClassTimeTableDataApiCall,
  getAllAddClassTimeTableDataApiCall,
  getAllClassesOfTimeTable,
  getAllSubjectsOfTimeTableApiCall,
  getAllTeachersOfTimeTableApiCall,
  deleteClassTimeTableDataApiCall,
  updateClassTimeTableDataApiCall,
} from "../helpers/api/home.api.calls";
import { toast } from "react-toastify";
import { useDebounce } from "../hooks/useDebounce";
import TimePickerCustom from "../components/TimePickerCustom";

const TABLE_HEAD = ["Day", "Date", "Time", "Subject", "Teacher", "", ""];

const Home = () => {
  const [editSingleClassTimeTableId, setEditSingleClassTimeTableId] =
    useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const [time, setTime] = useState("10:00"); // Default time
  const [addClassTimeTableData, setAddClassTimeTableData] = useState({
    teacherName: "",
    sectionName: "",
    subjectName: "",
    ClassName: "",
    classDay: "",
    classTime: "", // Default to 10:00 AM
  });
  const [searchClassTimeSchedule, setSearchClassTimeSchedule] = useState({
    ClassName: "",
    sectionName: "",
  });

  const queryClient = useQueryClient();

  const addClassTimeTableMutation = useMutation(addClassTimeTableDataApiCall, {
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Added Class TimeTable successfully!"); // Add toast on success
      }
      queryClient.invalidateQueries(["getAllAddClassTimeTable"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error adding class"); // Add toast on error
    },
  });
  const updateClassTimeTableMutation = useMutation(
    updateClassTimeTableDataApiCall,
    {
      onSuccess: (data) => {
        if (data.success) {
          toast.success("updated Class TimeTable successfully!"); // Add toast on success
        }
        queryClient.invalidateQueries([
          "getAllAddClassTimeTable",
          debouncedClassName,
          debouncedSectionName,
        ]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Error adding class"); // Add toast on error
      },
    }
  );
  const deleteSingleClassTimeTableMutation = useMutation(
    deleteClassTimeTableDataApiCall,
    {
      onSuccess: (data) => {
        if (data.success) {
          toast.success("deleted single class time table successfully!"); // Add toast on success
        }
        queryClient.invalidateQueries(["getAllAddClassTimeTable"]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Error adding class"); // Add toast on error
      },
    }
  );

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const { data: allTimeTableClassesOfData } = useQuery(
    ["getTimeTableAllClasses"], // Add page to the query key to refetch on page change
    () => getAllClassesOfTimeTable(), // Pass page and limit to API call
    {
      keepPreviousData: true, // Keep previous data while fetching new data
      refetchOnWindowFocus: false,
    }
  );
  const { data: allTimeTableTeachersOfData } = useQuery(
    ["getTimeTableAllTeachersData"],
    () => getAllTeachersOfTimeTableApiCall(), // Pass page and limit to API call
    {
      keepPreviousData: true, // Keep previous data while fetching new data
      refetchOnWindowFocus: false,
    }
  );
  const { data: allTimeTableSubjectsOfData } = useQuery(
    ["getTimeTableAllSubjectsData"],
    () => getAllSubjectsOfTimeTableApiCall(), // Pass page and limit to API call
    {
      keepPreviousData: true, // Keep previous data while fetching new data
      refetchOnWindowFocus: false,
    }
  );

  const debouncedClassName = useDebounce(
    searchClassTimeSchedule.ClassName,
    500
  );
  const debouncedSectionName = useDebounce(
    searchClassTimeSchedule.sectionName,
    500
  );

  const { data: getAllAddClassTimeTableData } = useQuery(
    ["getAllAddClassTimeTable", debouncedClassName, debouncedSectionName],
    () =>
      getAllAddClassTimeTableDataApiCall({
        ClassName: debouncedClassName,
        sectionName: debouncedSectionName,
      }),
    {
      keepPreviousData: true, // Keep previous data while fetching new data
      refetchOnWindowFocus: false,
    }
  );

  //console.log(getAllAddClassTimeTableData);
  const onAddClassSubmitHandler = (e) => {
    e.preventDefault();
    //console.log(addClassTimeTableData);
    if (addClassTimeTableData.subjectName === "") {
      alert("Please provide the subject name");
      return;
    }

    if (addClassTimeTableData.classDay === "") {
      alert("Please select the class day");
      return;
    }

    if (editSingleClassTimeTableId === null) {
      addClassTimeTableMutation.mutate(addClassTimeTableData);
    } else {
      updateClassTimeTableMutation.mutate({
        parentId: editSingleClassTimeTableId.parentId,
        childId: editSingleClassTimeTableId.childId,
        data: addClassTimeTableData,
      });

      setEditSingleClassTimeTableId(null);
    }
    setOpen(false);
    setAddClassTimeTableData({
      sectionName: "",
      teacherName: "",
      subjectName: "",
      ClassName: "",
      classDay: "",
      classTime: "",
    });
  };

  const deleteSingleClassTimeTableHandler = (parentId, childId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this class time schedule ?"
      )
    ) {
      return; // Exit if user doesn't confirm the deletion
    }
    deleteSingleClassTimeTableMutation.mutate({ parentId, childId });
  };
  const editSingleClassTimeTableHandler = (parentId, childId, data) => {
    setOpen(true);
    setAddClassTimeTableData({
      teacherName: data.teacherName,
      sectionName: data.sectionName,
      subjectName: data.subjectName,
      ClassName: data.ClassName,
      classDay: data.classDay,
      classTime: data.classTime,
    });
    setEditSingleClassTimeTableId({ parentId, childId });
  };

  return (
    <Card className="h-screen w-full p-5">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Class Table Presentation
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all Classes
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              onClick={() => {
                setAddClassTimeTableData({
                  sectionName: "",
                  teacherName: "",
                  subjectName: "",
                  ClassName: "",
                  classDay: "",
                  classTime: "",
                });
                handleOpen();
                setEditSingleClassTimeTableId(null);
              }}
              className="flex items-center gap-3"
              size="sm"
            >
              <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Class
              Time table
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="w-full max-w-sm min-w-[200px]">
            <div className="relative">
              <select
                value={searchClassTimeSchedule?.ClassName}
                onChange={(e) =>
                  setSearchClassTimeSchedule((prev) => ({
                    ...prev,
                    ClassName: e.target.value,
                  }))
                }
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
              >
                <option value="">Select Class Name</option>
                {allTimeTableClassesOfData &&
                allTimeTableClassesOfData.length > 0 ? (
                  allTimeTableClassesOfData.map((singleClass) => (
                    <option
                      key={singleClass?._id}
                      value={singleClass?.ClassName}
                    >
                      {singleClass?.ClassName}
                    </option>
                  ))
                ) : (
                  <option disabled>No classes available</option>
                )}
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.2"
                stroke="currentColor"
                className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                />
              </svg>
            </div>
          </div>
          <div className="w-full max-w-sm min-w-[200px]">
            <div className="relative">
              <select
                value={searchClassTimeSchedule?.sectionName}
                onChange={(e) =>
                  setSearchClassTimeSchedule((prev) => ({
                    ...prev,
                    sectionName: e.target.value,
                  }))
                }
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
              >
                <option value="">Select Class Section Name</option>
                {["A", "B", "C", "D", "E"].map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.2"
                stroke="currentColor"
                className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                />
              </svg>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* ------------------ Add Class Time table dialoag Start here ----------------------- */}
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              {editSingleClassTimeTableId === null
                ? "Add Class Time Table"
                : "Edit Class Time Table"}
            </Typography>
            <Input
              label="Section Name"
              type="text"
              value={addClassTimeTableData?.sectionName}
              onChange={(e) =>
                setAddClassTimeTableData((prev) => ({
                  ...prev,
                  sectionName: e.target.value,
                }))
              }
              disabled={editSingleClassTimeTableId === null ? false : true}
            />
            <Select
              value={addClassTimeTableData?.teacherName}
              onChange={(e) =>
                setAddClassTimeTableData((prev) => ({
                  ...prev,
                  teacherName: e,
                }))
              }
              label="Select Teacher"
            >
              {allTimeTableTeachersOfData &&
              allTimeTableTeachersOfData.length > 0 ? (
                allTimeTableTeachersOfData.map((singleTeacher) => (
                  <Option
                    key={singleTeacher?._id}
                    value={singleTeacher?.TeacherName}
                  >
                    {singleTeacher?.TeacherName}
                  </Option>
                ))
              ) : (
                <Option disabled>No teachers available</Option>
              )}
            </Select>
            <Select
              value={addClassTimeTableData?.ClassName}
              onChange={(e) =>
                setAddClassTimeTableData((prev) => ({
                  ...prev,
                  ClassName: e,
                }))
              }
              label="Select Class"
              disabled={editSingleClassTimeTableId === null ? false : true}
            >
              {allTimeTableClassesOfData &&
              allTimeTableClassesOfData.length > 0 ? (
                allTimeTableClassesOfData?.map((singleClass) => (
                  <Option key={singleClass?._id} value={singleClass?.ClassName}>
                    {singleClass?.ClassName}
                  </Option>
                ))
              ) : (
                <Option disabled>No classes available</Option>
              )}
            </Select>
            <Select
              value={addClassTimeTableData?.subjectName}
              onChange={(e) =>
                setAddClassTimeTableData((prev) => ({
                  ...prev,
                  subjectName: e,
                }))
              }
              label="Select Subject"
            >
              {allTimeTableSubjectsOfData &&
              allTimeTableSubjectsOfData.length > 0 ? (
                allTimeTableSubjectsOfData?.map((singleSubject) => (
                  <Option
                    key={singleSubject?._id}
                    value={singleSubject?.SubjectName}
                  >
                    {singleSubject?.SubjectName}
                  </Option>
                ))
              ) : (
                <Option disabled>No Subjects available</Option>
              )}
            </Select>
            <Select
              disabled={editSingleClassTimeTableId !== null}
              value={addClassTimeTableData?.classDay}
              onChange={(e) =>
                setAddClassTimeTableData((prev) => ({
                  ...prev,
                  classDay: e,
                }))
              }
              label="Select Day"
            >
              {days.map((day) => (
                <Option key={day} value={day}>
                  {day}
                </Option>
              ))}
            </Select>
            <div className="flex flex-col gap-2 w-full max-w-sm min-w-[200px]">
              <TimePickerCustom
                setAddClassTimeTableData={setAddClassTimeTableData}
                addClassTimeTableData={addClassTimeTableData}
              />
            </div>
          </CardBody>
          <CardFooter className="pt-0 flex flex-col gap-2">
            <Button
              onClick={onAddClassSubmitHandler}
              type="submit"
              variant="gradient"
              fullWidth
            >
              {editSingleClassTimeTableId === null ? "Add" : "Update"}
            </Button>
            <Button variant="filled" onClick={handleOpen} fullWidth>
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
      {/* ------------------ Add Class Time table dialoag End here ----------------------- */}

      <CardBody className="overflow-auto px-0 p-5 ">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <caption className="py-5 border-b-2 border-orange-700 ">
            <Typography variant="paragraph" color="blue-gray" className="">
              Class Name :{" "}
              {searchClassTimeSchedule?.ClassName === "" ? (
                <Typography variant="paragraph" color="blue-gray" className="">
                  Please Search Class Name to See Class Time Table
                </Typography>
              ) : (
                searchClassTimeSchedule?.ClassName
              )}
            </Typography>
            <Typography variant="paragraph" color="blue-gray" className="">
              Section Name :{" "}
              {searchClassTimeSchedule?.sectionName === "" ? (
                <Typography variant="paragraph" color="blue-gray" className="">
                  Please Search Section Name to See Class Time Table
                </Typography>
              ) : (
                searchClassTimeSchedule?.sectionName
              )}
            </Typography>
          </caption>
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                  >
                    {head}{" "}
                    {index !== TABLE_HEAD.length - 1 && (
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                    )}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getAllAddClassTimeTableData?.classSchedules?.map(
              (schedule, index) =>
                schedule.schedule?.map((item, innerIndex) => (
                  <tr key={`${index}-${innerIndex}`}>
                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        {schedule?.classDay}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        {getAllAddClassTimeTableData?.updatedAt?.split("T")[0]}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        {item?.classTime}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        {item?.subjectName}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        {item?.teacherName}
                      </Typography>
                    </td>
                    <td
                      onClick={() =>
                        deleteSingleClassTimeTableHandler(
                          getAllAddClassTimeTableData?._id,
                          item?._id
                        )
                      }
                    >
                      <IconButton variant="text">
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </td>
                    <td
                      onClick={() =>
                        editSingleClassTimeTableHandler(
                          getAllAddClassTimeTableData?._id,
                          item?._id,
                          {
                            ...item,
                            classDay: schedule?.classDay,
                            ClassName: getAllAddClassTimeTableData?.ClassName,
                            sectionName:
                              getAllAddClassTimeTableData?.sectionName,
                          }
                        )
                      }
                    >
                      <IconButton variant="text">
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
};

export default Home;
