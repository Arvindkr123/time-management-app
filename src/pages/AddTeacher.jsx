import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Dialog,
  DialogBody,
} from "@material-tailwind/react";
import { useState } from "react";
import {
  addTeacherApiPostCall,
  deleteSingleTeacherDataByApiDeleteCall,
  getAllTeacheresApiGetCall,
  updateSingleTeacherDataByApiDeleteCall,
} from "./../helpers/api/time-table.teacher";
import { toast } from "react-toastify";
const TABLE_HEAD = ["Teacher Name", "CreatedAt", "", ""];

const AddTeacher = () => {
  return (
    <div className="container mx-auto p-4">
      <SortableTable />
    </div>
  );
};
export default AddTeacher;

export function SortableTable() {
  const [open, setOpen] = useState(false);

  const [TeacherName, setTeacherName] = useState("");
  const [page, setPage] = useState(1); // Add state for current page
  const [limit] = useState(10); // Optional: Set a default limit per page
  const [search, setSearch] = useState("");
  const [editTeacherNameId, setEditTeacherNameId] = useState(null);

  const handleOpen = () => setOpen(!open);

  const queryClient = useQueryClient();

  // Add Teacher mutation
  const addTeacherMutation = useMutation(addTeacherApiPostCall, {
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Teacher Name added successfully!"); // Add toast on success
      }
      queryClient.invalidateQueries(["getTimeTableTeachers", page, search]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error adding Teacher Name"); // Add toast on error
    },
  });

  const updateTeacherMutation = useMutation(
    updateSingleTeacherDataByApiDeleteCall,
    {
      onSuccess: () => {
        toast.success("Teacher updated successfully!");
        queryClient.invalidateQueries(["getTimeTableTeachers", page, search]);
        setOpen(false);
      },
      onError: (error) => {
        toast.error(
          "Error updating class: " +
            (error.response?.data?.message || error.message)
        );
      },
    }
  );

  const onTeacherSubmitHandler = async (e) => {
    e.preventDefault();
    if (TeacherName === "") {
      toast.warn("Please provide the Teacher name");
      return;
    }
    if (editTeacherNameId) {
      try {
        await updateTeacherMutation.mutateAsync({
          id: editTeacherNameId,
          TeacherName,
        });
        setEditTeacherNameId(null);
        setOpen(false);
        setTeacherName(""); // Clear edit ID after update
      } catch (error) {
        console.error("Error while updating teacher name :", error);
      }
    } else {
      try {
        await addTeacherMutation.mutateAsync({ TeacherName });
        setOpen(false);
        setTeacherName("");
        setOpen(false);
        setEditTeacherNameId(null);
      } catch (error) {
        console.error("Error while adding teacher:", error);
      }
    }
    setTeacherName("");
  };

  const deleteMutation = useMutation(deleteSingleTeacherDataByApiDeleteCall, {
    onSuccess: () => {
      toast.success("Teacher deleted successfully!");
      queryClient.invalidateQueries(["getTimeTableTeachers", page, search]); // Refetch the data
    },
    onError: (error) => {
      toast.error(
        "Error deleting teacher: " +
          (error.response?.data?.message || error.message)
      );
    },
  });

  const { data: TABLE_ROWS, isFetching } = useQuery(
    ["getTimeTableTeachers", page, search], // Add page to the query key to refetch on page change
    () => getAllTeacheresApiGetCall(page, limit, search), // Pass page and limit to API call
    {
      keepPreviousData: true, // Keep previous data while fetching new data
      refetchOnWindowFocus: false,
    }
  );

  const handleNextPage = () => {
    if (page < TABLE_ROWS?.totalPages) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to the first page on search
  };

  const singleTeacherDeleteHandler = (teacherId) => {
    if (window.confirm("Are you sure you want to delete this teacher name?")) {
      deleteMutation.mutate(teacherId);
    }
  };

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Teachers list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all teachers
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              onClick={() => {
                setOpen((prev) => !prev);
                setTeacherName("");
                setEditTeacherNameId(null);
              }}
              className="flex items-center gap-3"
              size="sm"
            >
              <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Teacher
            </Button>
          </div>
        </div>

        {/* Dialog for Add class start here ------ */}
        <Dialog open={open} handler={handleOpen}>
          <Card color="transparent" shadow={false} className="p-5">
            <Typography variant="h4" color="blue-gray">
              {editTeacherNameId !== null ? "Update Teacher" : "Add Teacher"}
            </Typography>
            <form className="mt-8 mb-2">
              <div className="mb-1 flex flex-col gap-6">
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Teacher Name
                </Typography>
                <Input
                  size="lg"
                  placeholder="teacher name"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  value={TeacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                />
              </div>

              <Button
                onClick={onTeacherSubmitHandler}
                className="mt-6"
                fullWidth
              >
                {editTeacherNameId !== null ? "Update Teacher" : "Add Teacher"}
              </Button>
              <Button
                onClick={handleOpen}
                className="mt-3"
                variant="outlined"
                fullWidth
              >
                Cancel
              </Button>
            </form>
          </Card>
          <DialogBody></DialogBody>
        </Dialog>
        {/* Dialog for Add class end here ------ */}

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        {isFetching ? (
          <Typography variant="small" color="blue-gray" className="text-center">
            Loading...
          </Typography>
        ) : (
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
                        <ChevronUpDownIcon
                          strokeWidth={2}
                          className="h-4 w-4"
                        />
                      )}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS?.data?.map((teachersData, index) => {
                const isLast = index === TABLE_ROWS.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={teachersData._id}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {teachersData?.TeacherName}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {teachersData?.createdAt?.split("T")[0]}
                        </Typography>
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        setEditTeacherNameId(teachersData?._id);
                        setTeacherName(teachersData?.TeacherName);
                        setOpen(true);
                      }}
                      className={classes}
                    >
                      <IconButton variant="text">
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                    </td>
                    <td
                      onClick={() =>
                        singleTeacherDeleteHandler(teachersData?._id)
                      }
                      className={classes}
                    >
                      <IconButton variant="text">
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page {page} of {TABLE_ROWS?.totalPages || 1}
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            disabled={page === 1}
            onClick={handlePrevPage}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="sm"
            disabled={page === TABLE_ROWS?.totalPages}
            onClick={handleNextPage}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
