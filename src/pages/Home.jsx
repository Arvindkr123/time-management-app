/* eslint-disable no-unused-vars */
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  Avatar,
  Dialog,
  CardFooter,
  Select,
  Option,
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
} from "../helpers/api/home.api.calls";
import { toast } from "react-toastify";

const TABLE_HEAD = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Home = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const [time, setTime] = useState("10:00 AM"); // Default time
  const [addClassTimeTableData, setAddClassTimeTableData] = useState({
    teacherName: "",
    sectionName: "",
    subjectName: "",
    ClassName: "",
    classDay: "",
    classTime: "10:00 AM", // Default to 10:00 AM
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
      queryClient.invalidateQueries(["getAllAddClassTimeTable", 1]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error adding class"); // Add toast on error
    },
  });

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

  const { data: getAllAddClassTimeTableData } = useQuery(
    ["getAllAddClassTimeTable", 1],
    () => getAllAddClassTimeTableDataApiCall()
  );

  console.log("Fetched Class TimeTable Data:", getAllAddClassTimeTableData);

  console.log(getAllAddClassTimeTableData);

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
      classTime: "10:00 AM",
    });
  };

  return (
    <Card className="h-full w-full p-5">
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
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
          <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
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
              {allTimeTableTeachersOfData?.map((singleTeacher) => (
                <Option
                  key={singleTeacher?._id}
                  value={singleTeacher?.TeacherName}
                >
                  {singleTeacher?.TeacherName}
                </Option>
              ))}
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
              {allTimeTableClassesOfData?.map((singleClass) => (
                <Option key={singleClass?._id} value={singleClass?.ClassName}>
                  {singleClass?.ClassName}
                </Option>
              ))}
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
              {allTimeTableSubjectsOfData?.map((singleSubject) => (
                <Option
                  key={singleSubject?._id}
                  value={singleSubject?.SubjectName}
                >
                  {singleSubject?.SubjectName}
                </Option>
              ))}
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
              <div>Selected Time: {time}</div>
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

      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
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
            {getAllAddClassTimeTableData?.map((timeTableClassData, index) => {
              const isLast = index === getAllAddClassTimeTableData?.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={timeTableClassData?._id}>
                  <td className={classes}>
                    {TABLE_HEAD[0] === timeTableClassData.classDay ? (
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {timeTableClassData?.classTime}
                        </Typography>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold opacity-70"
                        >
                          {timeTableClassData?.subjectName}
                        </Typography>
                      </div>
                    ) : (
                      <td className="bg-red-600 text-white">No Class</td>
                    )}
                  </td>
                  <td className={classes}>
                    {TABLE_HEAD[1] === timeTableClassData.classDay ? (
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {timeTableClassData?.classTime}
                        </Typography>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold opacity-70"
                        >
                          {timeTableClassData?.subjectName}
                        </Typography>
                      </div>
                    ) : (
                      <td className="bg-red-600 text-white">No Class</td>
                    )}
                  </td>
                  <td className={classes}>
                    {TABLE_HEAD[2] === timeTableClassData.classDay ? (
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {timeTableClassData?.classTime}
                        </Typography>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold opacity-70"
                        >
                          {timeTableClassData?.subjectName}
                        </Typography>
                      </div>
                    ) : (
                      <td className="bg-red-600 text-white">No Class</td>
                    )}
                  </td>
                  <td className={classes}>
                    {TABLE_HEAD[3] === timeTableClassData.classDay ? (
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {timeTableClassData?.classTime}
                        </Typography>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold opacity-70"
                        >
                          {timeTableClassData?.subjectName}
                        </Typography>
                      </div>
                    ) : (
                      <td className="bg-red-600 text-white">No Class</td>
                    )}
                  </td>
                  <td className={classes}>
                    {TABLE_HEAD[4] === timeTableClassData.classDay ? (
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {timeTableClassData?.classTime}
                        </Typography>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold opacity-70"
                        >
                          {timeTableClassData?.subjectName}
                        </Typography>
                      </div>
                    ) : (
                      <td className="bg-red-600 text-white">No Class</td>
                    )}
                  </td>
                  <td className={classes}>
                    {TABLE_HEAD[5] === timeTableClassData.classDay ? (
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {timeTableClassData?.classTime}
                        </Typography>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold opacity-70"
                        >
                          {timeTableClassData?.subjectName}
                        </Typography>
                      </div>
                    ) : (
                      <td className="bg-red-600 text-white">No Class</td>
                    )}
                  </td>
                  <td className={classes}>
                    {TABLE_HEAD[6] === timeTableClassData.classDay ? (
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {timeTableClassData?.classTime}
                        </Typography>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold opacity-70"
                        >
                          {timeTableClassData?.subjectName}
                        </Typography>
                      </div>
                    ) : (
                      <td className="bg-red-600 text-white">No Class</td>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
};

export default Home;
