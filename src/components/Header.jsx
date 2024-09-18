import { Link, useLocation } from "react-router-dom";
import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

function NavList() {
  const location = useLocation();

  console.log(location.pathname);
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
      onAnimationStart={true}
      className="sticky top-0 w-full px-6 py-3 bg-white z-50"
    >
      <div className="flex items-center justify-between text-blue-gray-900 w-full">
        <Typography
          as={Link}
          to="/"
          variant="h6"
          className="mr-4 cursor-pointer py-1.5"
        >
          TimeTable
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
