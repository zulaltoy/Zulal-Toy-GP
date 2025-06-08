import React from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/slices/userSlice";
import AddressForm from "../components/AddressForm"
import { Link } from "react-router-dom";

const UserRegistration = () => {
  const dispatch = useDispatch();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    addresses: [
      {
        country: "",
        city: "",
        street: "",
        zip: "",
      },
    ],
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
    addresses: Yup.array().of(
      Yup.object().shape({
        country: Yup.string().required("Required"),
        city: Yup.string().required("Required"),
        street: Yup.string().required("Required"),
        zip: Yup.string().required("Required"),
        
      })
    ),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await dispatch(registerUser(values)).unwrap();
      alert("Registration successful: " + response.message);
      resetForm();
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 border shadow mt-10 rounded">
      <h2 className="text-2xl font-bold text-center mb-6">User Registration</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, errors, touched }) => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
                {touched.firstName && errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
                {touched.lastName && errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
                {touched.password && errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-3">Addresses</h3>

            <FieldArray name="addresses">
              {({ push, remove }) => (
                <div>
                  {values.addresses.map((_, index) => (
                    <AddressForm
                      key={index}
                      index={index}
                      removeAddress={remove}
                    />
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      push({
                        country: "",
                      
                        city: "",
                        street: "",
                        zip: "",
                      })
                    }
                    className="mt-2 text-blue-600 underline"
                  >
                    + Add Address
                  </button>
                </div>
              )}
            </FieldArray>

            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Register
              </button>
              <Link
                to="/login"
                className="text-blue-600 underline mt-2 inline-block"
              >
                Already have an account? Login
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserRegistration;
