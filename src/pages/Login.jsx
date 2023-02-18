import { Formik } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components";
import * as yup from "yup";
import { auth } from "..";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const onSubmitPress = async (values) => {
    setError(null)
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // navigate("/home");
        console.log(user);
        navigate('/')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
        console.log(errorCode, errorMessage);
      });
  };

  const accountValidationSchema = yup.object().shape({
    email: yup.string().required("Email Address is Required"),
    password: yup.string().required("Password is required"),
  });

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Login</h1>
        <hr />
        <div class="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <Formik
              validateOnBlur={false}
              validationSchema={accountValidationSchema}
              initialValues={{
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
                  <div class="my-3">
                    <label for="display-4">Email address</label>
                    <input
                      onChange={handleChange("email")}
                      value={values.email}
                      type="email"
                      class="form-control"
                      id="floatingInput"
                      placeholder="name@example.com"
                    />
                    <p style={{ color: "red" }} className="mb-3">
                      {errors.email}
                    </p>
                    {/* {touched.email && errors.email && (
                    )} */}
                  </div>
                  <div class="my-3">
                    <label for="floatingPassword display-4">Password</label>
                    <input
                      onChange={handleChange("password")}
                      value={values.password}
                      type="password"
                      class="form-control"
                      id="floatingPassword"
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
                      New Here?{" "}
                      <Link
                        to="/register"
                        className="text-decoration-underline text-info"
                      >
                        Register
                      </Link>{" "}
                    </p>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={handleSubmit}
                      class="my-2 mx-auto btn btn-dark"
                      type="submit"
                      // disabled
                    >
                      Login
                    </button>
                    {error && (
                      <p style={{ color: "red" }} className="mb-3">
                        {error}
                      </p>
                    )}
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
