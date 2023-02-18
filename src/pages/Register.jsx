import React, { useState } from "react";
import { Navbar } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import { auth } from "..";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Register = () => {
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  console.log(auth.currentUser)

  const accountValidationSchema = yup.object().shape({
    name: yup.string().required("name is Required"),
    email: yup
      .string()
      .email("Please enter valid email")
      .required("Email Address is Required"),
    password: yup
      .string()
      .min(8, ({ min }) => `Sorry, your password is too short.`)
      .required("Password is required"),
  });

  const onSubmitPress = async (values) => {
    await createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("user", user);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
        console.log(errorCode, errorMessage);
        // ..
      });
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Register</h1>
        <hr />
        <div class="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <Formik
              validateOnBlur={false}
              validationSchema={accountValidationSchema}
              initialValues={{
                name: "",
                email: "",
                password: "",
              }}
              onSubmit={onSubmitPress}
            >
              {({
                values,
                handleChange,
                errors,
                setFieldTouched,
                touched,
                isValid,
                handleSubmit,
                handleBlur,
                setFieldValue,
              }) => (
                <form>
                  <div class="form my-3">
                    <label for="Name">Full Name</label>
                    <input
                      onChange={handleChange("name")}
                      value={values.name}
                      type="name"
                      class="form-control"
                      id="Name"
                      placeholder="Enter Your Name"
                    />
                    {touched.name && errors.name && (
                      <p style={{ color: "red" }} className="mb-3">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div class="form my-3">
                    <label for="Email">Email address</label>
                    <input
                      onChange={handleChange("email")}
                      value={values.email}
                      type="email"
                      class="form-control"
                      id="Email"
                      placeholder="name@example.com"
                    />
                    {touched.email && errors.email && (
                      <p style={{ color: "red" }} className="mb-3">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div class="form  my-3">
                    <label for="Password">Password</label>
                    <input
                      onChange={handleChange("password")}
                      value={values.password}
                      type="password"
                      class="form-control"
                      id="Password"
                      placeholder="Password"
                    />
                    {touched.password && errors.password && (
                      <p style={{ color: "red" }} className="mb-3">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div className="my-3">
                    <p>
                      Already has an account?{" "}
                      <Link
                        to="/login"
                        className="text-decoration-underline text-info"
                      >
                        Login
                      </Link>{" "}
                    </p>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={handleSubmit}
                      class="my-2 mx-auto btn btn-dark"
                      type="submit"
                    >
                      Register
                    </button>
                  </div>
                  {error && (
                    <p style={{ color: "red" }} className="mb-3">
                      {error}
                    </p>
                  )}
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
