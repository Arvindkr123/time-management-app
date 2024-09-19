import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
  Dialog,
  DialogBody,
} from "@material-tailwind/react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  addClassApiPostCall,
  deleteSingleClassDataByApiDeleteCall,
  getAllClassesApiGetCall,
  updateSingleClassDataByApiDeleteCall,
} from "../helpers/api/time-table.class";

const TABLE_HEAD = ["Class Name", "Created At", "", ""];

const AddClass = () => {
  return (
    <div className="container mx-auto p-4">
      <SortableTable />
    </div>
  );
};
export default AddClass;

export function SortableTable() {
  const [open, setOpen] = useState(false);
  const [ClassName, setClassName] = useState("");
  const [page, setPage] = useState(1); // Add state for current page
  const [limit] = useState(10); // Optional: Set a default limit per page
  const [search, setSearch] = useState("");
  const [editClassNameId, setEditClassNameId] = useState(null);

  const handleOpen = () => setOpen(!open);

  const queryClient = useQueryClient();

  const addClassMutation = useMutation(addClassApiPostCall, {
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Class Name added successfully!"); // Add toast on success
      }
      queryClient.invalidateQueries(["getTimeTableClasses", page, search]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error adding class"); // Add toast on error
    },
  });

  const deleteMutation = useMutation(deleteSingleClassDataByApiDeleteCall, {
    onSuccess: () => {
      toast.success("Class deleted successfully!");
      queryClient.invalidateQueries(["getTimeTableClasses", page, search]); // Refetch the data
    },
    onError: (error) => {
      toast.error(
        "Error deleting class: " +
          (error.response?.data?.message || error.message)
      );
    },
  });

  const updateClassMutation = useMutation(
    updateSingleClassDataByApiDeleteCall,
    {
      onSuccess: () => {
        toast.success("Class updated successfully!");
        queryClient.invalidateQueries(["getTimeTableClasses", page, search]);
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

  const onClassSubmitHandler = async (e) => {
    e.preventDefault();
    if (ClassName === "") {
      toast.warn("Please provide the class name");
      return;
    }
    if (editClassNameId) {
      try {
        await updateClassMutation.mutateAsync({
          id: editClassNameId,
          ClassName,
        });
        setEditClassNameId(null);
        setOpen(false);
        setClassName(""); // Clear edit ID after update
      } catch (error) {
        console.error("Error while updating class:", error);
      }
    } else {
      try {
        await addClassMutation.mutateAsync({ ClassName });
        setOpen(false);
        setClassName("");
      } catch (error) {
        console.error("Error while adding class:", error);
      }
    }
    setClassName("");
  };

  const { data: TABLE_ROWS, isFetching } = useQuery(
    ["getTimeTableClasses", page, search], // Add page to the query key to refetch on page change
    () => getAllClassesApiGetCall(page, limit, search), // Pass page and limit to API call
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

  const singleClassDeleteHandler = (classId) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      deleteMutation.mutate(classId);
    }
  };

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Classes list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all classes
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              disabled={addClassMutation.isLoading}
              onClick={() => {
                setOpen(true);
                setEditClassNameId(null); // Clear edit ID to add new class
              }}
              className="flex items-center gap-3"
              size="sm"
            >
              <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Class
            </Button>
          </div>
        </div>

        {/* Dialog for Add/Update class */}
        <Dialog open={open} handler={handleOpen}>
          <Card color="transparent" shadow={false} className="p-5">
            <Typography variant="h4" color="blue-gray">
              {editClassNameId ? "Update Class" : "Add Class"}
            </Typography>
            <form className="mt-8 mb-2" onSubmit={onClassSubmitHandler}>
              <div className="mb-1 flex flex-col gap-6">
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Class Name
                </Typography>
                <Input
                  value={ClassName}
                  onChange={(e) => setClassName(e.target.value)}
                  size="lg"
                  placeholder="Class name"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>

              <Button
                type="submit"
                className="mt-6"
                fullWidth
                disabled={
                  addClassMutation.isLoading || updateClassMutation.isLoading
                }
              >
                {editClassNameId ? "Update Class" : "Add Class"}
              </Button>
              <Button
                onClick={() => setOpen(false)}
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

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={search}
              onChange={handleSearchChange} // Add search handler
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
              {TABLE_ROWS?.data?.map((classesData, index) => {
                const isLast = index === TABLE_ROWS.data.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={classesData?._id}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {classesData?.ClassName}
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
                          {classesData?.createdAt?.split("T")[0]}
                        </Typography>
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        setEditClassNameId(classesData._id);
                        setClassName(classesData.ClassName);
                        setOpen(true);
                      }}
                      className={classes}
                    >
                      <Tooltip content="Edit Class">
                        <IconButton variant="text">
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                    <td
                      onClick={() => singleClassDeleteHandler(classesData?._id)}
                      className={classes}
                    >
                      <Tooltip content="Delete Class">
                        <IconButton variant="text">
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
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
