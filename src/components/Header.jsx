/* eslint-disable react/no-unknown-property */
import { Link, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useMutation } from "react-query";
import { logoutUserApiCall } from "../helpers/api/user.auth.api.calls";
import { toast } from "react-toastify";

function NavList() {
  const location = useLocation();

  const navigate = useNavigate();

  //console.log(location.pathname);

  const userLogoutMutation = useMutation(logoutUserApiCall, {
    onSuccess: (data) => {
      if (data.success) {
        toast.success("user logout successfully!"); // Add toast on success
      }
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error adding class"); // Add toast on error
    },
  });

  const logoutHandler = () => {
    userLogoutMutation.mutate();
  };

  return (
    <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <Link
          to="/add-class"
          className={`flex items-center transition-colors ${
            location.pathname === "/add-class"
              ? "underline text-red-600 tracking-widest" // Active state: underline and a distinct color
              : "text-gray-500 hover:text-blue-500" // Inactive state: default color with hover effect
          }`}
        >
          Add Class
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <Link
          to="/add-teacher"
          className={`flex items-center transition-colors ${
            location.pathname === "/add-teacher"
              ? "underline text-red-600 tracking-widest" // Active state: underline and a distinct color
              : "text-gray-500 hover:text-blue-500" // Inactive state: default color with hover effect
          }`}
        >
          Add Teacher
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <Link
          to="/add-subject"
          className={`flex items-center transition-colors ${
            location.pathname === "/add-subject"
              ? "underline text-red-600 tracking-widest" // Active state: underline and a distinct color
              : "text-gray-500 hover:text-blue-500" // Inactive state: default color with hover effect
          }`}
        >
          Add Subject
        </Link>
      </Typography>
      <Menu>
        <MenuHandler>
          <Avatar
            variant="circular"
            alt="tania andrew"
            className="cursor-pointer"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          />
        </MenuHandler>
        <MenuList>
          <MenuItem
            onClick={logoutHandler}
            className="flex items-center gap-2 "
          >
            <svg
              width="16"
              height="14"
              viewBox="0 0 16 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1 0C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V13C0 13.2652 0.105357 13.5196 0.292893 13.7071C0.48043 13.8946 0.734784 14 1 14C1.26522 14 1.51957 13.8946 1.70711 13.7071C1.89464 13.5196 2 13.2652 2 13V1C2 0.734784 1.89464 0.48043 1.70711 0.292893C1.51957 0.105357 1.26522 0 1 0ZM11.293 9.293C11.1108 9.4816 11.01 9.7342 11.0123 9.9964C11.0146 10.2586 11.1198 10.5094 11.3052 10.6948C11.4906 10.8802 11.7414 10.9854 12.0036 10.9877C12.2658 10.99 12.5184 10.8892 12.707 10.707L15.707 7.707C15.8945 7.51947 15.9998 7.26516 15.9998 7C15.9998 6.73484 15.8945 6.48053 15.707 6.293L12.707 3.293C12.6148 3.19749 12.5044 3.12131 12.3824 3.0689C12.2604 3.01649 12.1292 2.9889 11.9964 2.98775C11.8636 2.9866 11.7319 3.0119 11.609 3.06218C11.4861 3.11246 11.3745 3.18671 11.2806 3.2806C11.1867 3.3745 11.1125 3.48615 11.0622 3.60905C11.0119 3.73194 10.9866 3.86362 10.9877 3.9964C10.9889 4.12918 11.0165 4.2604 11.0689 4.3824C11.1213 4.50441 11.1975 4.61475 11.293 4.707L12.586 6H5C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7C4 7.26522 4.10536 7.51957 4.29289 7.70711C4.48043 7.89464 4.73478 8 5 8H12.586L11.293 9.293Z"
                fill="#90A4AE"
              />
            </svg>
            <Typography variant="small" className="font-medium">
              Sign Out
            </Typography>
          </MenuItem>
        </MenuList>
      </Menu>
    </ul>
  );
}

export function NavbarSimple() {
  const [openNav, setOpenNav] = React.useState(false);

  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <Navbar
      fullWidth={true}
      variant="filled"
      onAnimationStart={() => {}}
      className="sticky top-0 w-full px-6 py-3 bg-white z-50"
    >
      <div className="flex items-center justify-between text-blue-gray-900 w-full">
        <Typography
          as={Link}
          to="/"
          variant="h4"
          className="mr-4 cursor-pointer py-1.5"
        >
          CDS-TimeTable
        </Typography>
        <div className="hidden lg:block">
          <NavList />
        </div>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList />
      </Collapse>
    </Navbar>
  );
}

const Header = () => {
  return <NavbarSimple />;
};

export default Header;
