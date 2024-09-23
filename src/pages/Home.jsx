/* eslint-disable no-unused-vars */
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  TrashIcon,
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
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css"; // For proper clock UI if you want to enable the clock
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  addClassTimeTableDataApiCall,
  getAllAddClassTimeTableDataApiCall,
  getAllClassesOfTimeTable,
  getAllSubjectsOfTimeTableApiCall,
  getAllTeachersOfTimeTableApiCall,
  deleteClassTimeTableDataApiCall,
} from "../helpers/api/home.api.calls";
import { toast } from "react-toastify";
import { useDebounce } from "../hooks/useDebounce";

const TABLE_HEAD = ["Day", "Time", "Subject", "Teacher", ""];

const Home = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const [time, setTime] = useState("10:00"); // Default time
  const [addClassTimeTableData, setAddClassTimeTableData] = useState({
    teacherName: "",
    sectionName: "",
    subjectName: "",
    ClassName: "",
    classDay: "",
    classTime: "10:00", // Default to 10:00 AM
  });
  const [searchClassTimeSchedule, setSearchClassTimeSchedule] = useState({
    ClassName: "",
    sectionName: "",
  });

  const timeSelectHandler = (timeData) => {
    // This will give time in AM/PM format
    setTime(timeData);
    setAddClassTimeTableData((prev) => ({ ...prev, classTime: timeData }));
  };
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

    addClassTimeTableMutation.mutate(addClassTimeTableData);
    setOpen(false);
    setTime("10:00 AM");
    setAddClassTimeTableData({
      sectionName: "",
      teacherName: "",
      subjectName: "",
      ClassName: "",
      classDay: "",
      classTime: "10:00",
    });
  };

  const convertTimeTo12Hour = (time) => {
    if (!time) return ""; // Return empty if no time is provided

    // Split the time into hours and minutes
    let [hours, minutes] = time.split(":");

    // Convert hours to a number
    hours = parseInt(hours, 10);

    // Determine AM or PM
    const amOrPm = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours = hours % 12 || 12; // If hours is 0 or 12, set it to 12

    // Format the hours and minutes
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.padStart(2, "0");

    return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
  };

  const deleteSingleClassTimeTableHandler = (parentId, childId) => {
    deleteSingleClassTimeTableMutation.mutate({ parentId, childId });
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
              onClick={handleOpen}
              className="flex items-center gap-3"
              size="sm"
            >
              <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Class
              Time table
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="w-full md:w-72">
            <Input
              label="Search By ClassName"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={searchClassTimeSchedule?.ClassName}
              onChange={(e) =>
                setSearchClassTimeSchedule((prev) => ({
                  ...prev,
                  ClassName: e.target.value,
                }))
              }
            />
          </div>
          <div className="w-full md:w-72">
            <Input
              label="Search By Section Name"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={searchClassTimeSchedule?.sectionName}
              onChange={(e) =>
                setSearchClassTimeSchedule((prev) => ({
                  ...prev,
                  sectionName: e.target.value,
                }))
              }
            />
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
              Add Class Time Table
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
              <label>Time:hour</label>
              <TimePicker
                onChange={(e) => timeSelectHandler(e)}
                value={time}
                disableClock={true} // Hide the clock interface
                format="h:mm a" // Format time to 12-hour with AM/PM
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
              Add
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
              {searchClassTimeSchedule?.ClassName === ""
                ? "Please Search Class Name to See Class Time Table"
                : searchClassTimeSchedule?.ClassName}
            </Typography>
            <Typography variant="paragraph" color="blue-gray" className="">
              Section Name :{" "}
              {searchClassTimeSchedule?.sectionName === ""
                ? "Please Search Section Name to See Class Time Table"
                : searchClassTimeSchedule?.sectionName}
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
                        {convertTimeTo12Hour(item?.classTime)}
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
