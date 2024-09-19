import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
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
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import {
  addSubjectApiPostCall,
  deleteSingleSubjectDataByApiDeleteCall,
  getAllSubjectsApiGetCall,
  updateSingleSubjectDataByApiDeleteCall,
} from "../helpers/api/time-table.subject";
const TABLE_HEAD = ["Subject Name", "Created At", "", ""];

const AddSubject = () => {
  return (
    <div className="container mx-auto p-4">
      <SortableTable />
    </div>
  );
};
export default AddSubject;

export function SortableTable() {
  const [open, setOpen] = useState(false);

  const [SubjectName, setSubjectName] = useState("");
  const [page, setPage] = useState(1); // Add state for current page
  const [limit] = useState(10); // Optional: Set a default limit per page
  const [search, setSearch] = useState("");
  const [editSubjectNameId, setEditSubjectNameId] = useState(null);

  const handleOpen = () => setOpen(!open);

  const queryClient = useQueryClient();

  const addSubjectMutation = useMutation(addSubjectApiPostCall, {
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Subject Name added successfully!"); // Add toast on success
      }
      queryClient.invalidateQueries(["getTimeTableSubjects", page, search]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error adding class"); // Add toast on error
    },
  });

  const deleteMutation = useMutation(deleteSingleSubjectDataByApiDeleteCall, {
    onSuccess: () => {
      toast.success("Subject Name deleted successfully!");
      queryClient.invalidateQueries(["getTimeTableSubjects", page, search]); // Refetch the data
    },
    onError: (error) => {
      toast.error(
        "Error deleting Subject: " +
          (error.response?.data?.message || error.message)
      );
    },
  });

  const updateSubjectMutation = useMutation(
    updateSingleSubjectDataByApiDeleteCall,
    {
      onSuccess: () => {
        toast.success("Subject Name updated successfully!");
        queryClient.invalidateQueries(["getTimeTableSubjects", page, search]);
        setOpen(false);
      },
      onError: (error) => {
        toast.error(
          "Error updating Subject: " +
            (error.response?.data?.message || error.message)
        );
      },
    }
  );

  const onSubjectSubmitHandler = async (e) => {
    e.preventDefault();
    if (SubjectName === "") {
      toast.warn("Please provide the subject name");
      return;
    }
    if (editSubjectNameId) {
      try {
        await updateSubjectMutation.mutateAsync({
          id: editSubjectNameId,
          SubjectName,
        });
        setEditSubjectNameId(null);
        setOpen(false);
        setSubjectName(""); // Clear edit ID after update
      } catch (error) {
        console.error("Error while updating class:", error);
      }
    } else {
      try {
        await addSubjectMutation.mutateAsync({ SubjectName });
        setOpen(false);
        setSubjectName("");
      } catch (error) {
        console.error("Error while adding class:", error);
      }
    }
    setSubjectName("");
  };

  const { data: TABLE_ROWS, isFetching } = useQuery(
    ["getTimeTableSubjects", page, search], // Add page to the query key to refetch on page change
    () => getAllSubjectsApiGetCall(page, limit, search), // Pass page and limit to API call
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

  const singleSubjectDeleteHandler = (subjectId) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      deleteMutation.mutate(subjectId);
    }
  };

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Subjects list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all subjects
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              onClick={() => {
                setOpen(true);
                setSubjectName("");
                setEditSubjectNameId(null);
              }}
              className="flex items-center gap-3"
              size="sm"
            >
              <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Subject
            </Button>
          </div>
        </div>

        {/* Dialog for Add class start here ------ */}
        <Dialog open={open} handler={handleOpen}>
          <Card color="transparent" shadow={false} className="p-5">
            <Typography variant="h4" color="blue-gray">
              {editSubjectNameId !== null ? "Edit Subject Name" : "Add Subject"}
            </Typography>
            <form className="mt-8 mb-2" onSubmit={onSubjectSubmitHandler}>
              <div className="mb-1 flex flex-col gap-6">
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Subject Name
                </Typography>
                <Input
                  size="lg"
                  placeholder="subject name"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  value={SubjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                />
              </div>

              <Button
                onClick={onSubjectSubmitHandler}
                disabled={
                  addSubjectMutation.isLoading ||
                  updateSubjectMutation.isLoading
                }
                className="mt-6"
                fullWidth
              >
                {editSubjectNameId !== null
                  ? "Edit Subject Name"
                  : "Add Subject"}
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
              {TABLE_ROWS?.data?.map((subjectsData, index) => {
                const isLast = index === TABLE_ROWS.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={subjectsData?._id}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {subjectsData?.SubjectName}
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
                          {subjectsData?.createdAt?.split("T")[0]}
                        </Typography>
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        setOpen(true);
                        setSubjectName(subjectsData?.SubjectName);
                        setEditSubjectNameId(subjectsData?._id);
                      }}
                      className={classes}
                    >
                      <IconButton variant="text">
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                    </td>
                    <td
                      onClick={() =>
                        singleSubjectDeleteHandler(subjectsData?._id)
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
