import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
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
  Tooltip,
  Dialog,
  DialogBody,
} from "@material-tailwind/react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  addClassApiPostCall,
  getAllClassesApiGetCall,
} from "../helpers/api/time-table.class";

const TABLE_HEAD = ["Class Name", "Created At", ""];

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

  const handleOpen = () => setOpen(!open);

  const queryClient = useQueryClient();
  const mutation = useMutation(addClassApiPostCall, {
    onSuccess: (data) => {
      if (data.data.success) {
        toast.success("Class Name added successfully!"); // Add toast on success
      }
      queryClient.invalidateQueries(["getTimeTableClasses", page, search]);
    },
    onError: (error) => {
      toast.error(error.response.data.message); // Add toast on error
    },
  });

  const onClassSubmitHandler = async (e) => {
    e.preventDefault();
    if (ClassName === "") {
      toast.warn("Please provide the class name");
      return;
    }
    try {
      await mutation.mutateAsync({ ClassName });
      setOpen(false);
      setClassName("");
    } catch (error) {
      console.error("Error while adding class:", error);
    }
  };

  // Fetch paginated classes using React Query
  const { data: TABLE_ROWS, isFetching } = useQuery(
    ["getTimeTableClasses", page, search], // Add page to the query key to refetch on page change
    () => getAllClassesApiGetCall(page, limit, search), // Pass page and limit to API call
    {
      keepPreviousData: true, // Keep previous data while fetching new data
      refetchOnWindowFocus: false,
    }
  );

  //console.log(TABLE_ROWS);

  // Pagination handler
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

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Classess list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all classess
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              disabled={mutation.isLoading}
              onClick={handleOpen}
              className="flex items-center gap-3"
              size="sm"
            >
              <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Class
            </Button>
          </div>
        </div>

        {/* Dialog for Add class start here ------ */}
        <Dialog open={open} handler={handleOpen}>
          <Card color="transparent" shadow={false} className="p-5">
            <Typography variant="h4" color="blue-gray">
              Add Class
            </Typography>
            <form className="mt-8 mb-2">
              <div className="mb-1 flex flex-col gap-6">
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Class Name
                </Typography>
                <Input
                  value={ClassName}
                  onChange={(e) => setClassName(e.target.value)}
                  size="lg"
                  placeholder="classs name"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>

              <Button
                type="submit"
                onClick={onClassSubmitHandler}
                className="mt-6"
                fullWidth
              >
                add class
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
                const isLast = index === TABLE_ROWS.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={name}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {classesData.ClassName}
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
                    <td onClick={handleOpen} className={classes}>
                      <Tooltip content="Edit Class">
                        <IconButton variant="text">
                          <PencilIcon className="h-4 w-4" />
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
