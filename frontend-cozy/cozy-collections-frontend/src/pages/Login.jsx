import React, { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BsPersonFill, BsLockFill } from "react-icons/bs";
import { login } from "../store/slices/authSlice";


const Login = () => {

    const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const authErrorMessage = useSelector((state) => state.auth.errorMessage);
  const from = location.state?.from?.pathname || "/";

  useEffect(()=>{
    if(isAuthenticated){
        navigate(from,{replace: true});
        window.location.reload();
    }
  },[isAuthenticated,navigate,from]);

  const formik = useFormik({
    initialValues:{
        email:"",
        password:"",
    },
    validationSchema: Yup.object({
        email : Yup.string().email("invalid email").required("email is required"),
        password : Yup.string().min(6, "password must be at least 6 characters").required("password is required"),

    }),
    onSubmit: async (values,{setSubmitting,setErrors})=>{
        try{
            await dispatch(login(values)).unwrap();
        }catch{
            setErrors({general: authErrorMessage || "login failed"});
        }finally{
            setSubmitting(false);
        }
    }
  })
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {formik.errors.general && (
          <div className="text-red-500 text-center mb-4">{formik.errors.general}</div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="flex items-center border rounded px-3 py-2">
              <BsPersonFill className="text-gray-500 mr-2" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full outline-none"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center border rounded px-3 py-2">
              <BsLockFill className="text-gray-500 mr-2" />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="w-full outline-none"
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4">
          Don't have an account yet?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};


export default Login