import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUserApiCall } from "../helpers/api/user.auth.api.calls";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const userLoginMutation = useMutation(loginUserApiCall, {
    onSuccess: () => {
      //console.log(data);
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error while login user"); // Add toast on error
    },
  });

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (user.email === "") {
      toast.error("Please enter email");
      return;
    } else if (user.password === "") {
      toast.error("Please enter password");
      return;
    }
    userLoginMutation.mutate(user);
  };
  return (
    <div className="flex container">
      {/* Left Section - Image */}
      <div className="hidden md:flex w-1/2 bg-blue-500 items-center justify-center">
        <img
          src="/bg.jpg"
          alt="Login Illustration"
          className="object-cover w-full h-screen"
        />
      </div>

      {/* Right Section - Login Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white pl-10">
        <Card color="transparent" shadow={false}>
          <Typography variant="h4" color="blue-gray">
            Sign In
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Nice to meet you! Enter your details to signin.
          </Typography>
          <form
            onSubmit={onSubmitHandler}
            className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          >
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Your Email
              </Typography>
              <Input
                size="lg"
                placeholder="name@mail.com"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={user.email}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Password
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="********"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={user.password}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </div>
            <Button className="mt-6" fullWidth type="submit">
              sign in
            </Button>
            <Typography color="gray" className="mt-4 text-center font-normal">
              Do not have an account?{" "}
              <Link to="/register" className="font-medium text-gray-900">
                Sign Up
              </Link>
            </Typography>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
