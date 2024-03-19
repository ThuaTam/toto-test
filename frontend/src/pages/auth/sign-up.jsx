import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { createUser, isValidEmail } from "@/api/api";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from 'react-toastify';


export function SignUp() {
  const [dataSignUp, setDataSignUp] = useState(null);

  const Register = async () => {
    if (!dataSignUp || !dataSignUp?.email || !dataSignUp?.username || !dataSignUp?.password || !dataSignUp?.confirmPassword) {
      toast.error('Please complete all information', { position: 'top - right' });
      return
    }
    if (dataSignUp?.password !== dataSignUp?.confirmPassword) {
      toast.error('Password confirmation is incorrect', { position: 'top-right' });
      return
    }
    if (!isValidEmail(dataSignUp?.email)) {
      toast.error('Email is incorrect', { position: 'top-right' });
      return
    }
    let data = {
      fullname: dataSignUp?.username,
      username: dataSignUp?.username,
      email: dataSignUp?.email,
      password: dataSignUp?.password
    }
    try {
      const response = await createUser(data);
      if (!response.error) {
        toast.success(response.message, { position: 'top-right' });
        console.log(response.error)
        window.location.href = '/auth/sign-in';
      } else {
        toast.error(response.message, { position: 'top-right' });     
      }
    } catch (error) {
      toast.error('Failed to create user', { position: 'top-right' });
    }
  }
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     window.location.href = '/dashboard/tables';
  //   }

  // }, []);
  return (
    <div>
      <div className="m-8 flex">
        <ToastContainer />

        <div className="w-2/5 h-full hidden lg:block">
          <img
            src="/img/pattern.png"
            className="h-full w-full object-cover rounded-3xl"
          />
        </div>
        <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
          <div className="text-center">
            <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
            <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to register.</Typography>
          </div>
          <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Your email
              </Typography>
              <Input
                size="lg"
                placeholder="name@mail.com"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={dataSignUp?.email}
                onChange={(e) => setDataSignUp({ ...dataSignUp, email: e.target.value })}
              />
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Your Username
              </Typography>
              <Input
                size="lg"
                placeholder="name"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={dataSignUp?.username}
                onChange={(e) => setDataSignUp({ ...dataSignUp, username: e.target.value })}
              />
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Your Password
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="password"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={dataSignUp?.password}
                onChange={(e) => setDataSignUp({ ...dataSignUp, password: e.target.value })}
              />
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Confirm Password
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="confirm password"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={dataSignUp?.confirmPassword}
                onChange={(e) => setDataSignUp({ ...dataSignUp, confirmPassword: e.target.value })}
              />
            </div>

            <Button className="mt-6" fullWidth onClick={() => Register()}>
              Register Now
            </Button>


            <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
              Already have an account?
              <Link to="/auth/sign-in" className="text-gray-900 ml-1">Sign in</Link>
            </Typography>
          </form>

        </div>
      </div>
    </div>
  );
}

export default SignUp;
