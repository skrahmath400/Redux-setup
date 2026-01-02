// src/Logincomponents/LoginForm.jsx  (or src/components/LoginForm.jsx)
import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { encryptAndManipulate } from "../utils/encryptionUtils";
import { loginSubmit, getScreenPermissions2 } from "../queries/loginquery";
import { mergeAllRolePermissions } from "../utils/permissionUtils";
import { setRolePermissions, setEmployeeId } from "../slices/authorizationSlice";
import { persistor } from "../redux/store";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [serverErrors, setServerErrors] = useState({
    emailId: null,
    password: null,
    general: null,
  });

  const [customErrorType, setCustomErrorType] = useState(null);

  const initialValues = { emailId: "", password: "" };

  const validate = (values) => {
    const errors = {};
    if (!values.emailId) {
      errors.emailId = "Email Id is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailId)) {
      errors.emailId = "Invalid email format";
    }
    if (!values.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleLoginSubmit = async (values, { setSubmitting }) => {
    setCustomErrorType(null);
    setServerErrors({ emailId: null, password: null, general: null });

    try {
      const { emailId, password } = values;
      console.log("[Login] Attempting login for:", emailId);

      const encryptedPassword = encryptAndManipulate(password, 1);
      const payload = { emailId: emailId.trim(), password: encryptedPassword };

      const res = await loginSubmit(payload);
      const resp = res?.data ?? res;

      console.log("[Login] Backend Response:", resp);

      // Handle specific error messages
      if (resp?.reason && resp.reason !== "Login successful") {
        const ERROR_MAP = {
          "Password Incorrect": () => ({ password: "Incorrect password" }),
          "User is not active": () => { setCustomErrorType("deactivated"); return {}; },
          "Email is not existed": () => { setCustomErrorType("invalid"); return {}; },
        };

        const updater = ERROR_MAP[resp.reason];
        if (updater) {
          setServerErrors(updater());
        } else {
          setServerErrors({ general: resp.reason });
        }
        setSubmitting(false);
        return;
      }

      // SUCCESS PATH
      if (resp?.loginSuccess === true) {
        console.log("[Login] Login successful!");

        const accessToken = resp.jwt?.accessToken;
        const tokenType = resp.jwt?.tokenType || "Bearer";
        const expiresAt = resp.jwt?.expiresAtEpochSeconds;

        if (!accessToken) {
          console.error("[Login] Token missing in response!");
          setServerErrors({ general: "Login succeeded but no token received." });
          setSubmitting(false);
          return;
        }

        console.log("[Login] Token received and saving...");

        // Save auth data
        localStorage.setItem("authToken", accessToken);
        localStorage.setItem("authTokenType", tokenType);
        if (expiresAt) localStorage.setItem("authTokenExp", String(expiresAt));

        // Save employee info
        localStorage.setItem("empName", resp.empName || "");
        localStorage.setItem("empId", String(resp.empId || ""));
        localStorage.setItem("designation", resp.designation || "");
        localStorage.setItem("category", resp.category || "");
        localStorage.setItem("campusName", resp.campusName || "");
        localStorage.setItem("campusCategory", resp.campusCategory || "");

        // Fetch screen permissions
        try {
          console.log("[Login] Requesting screen permissions...");
          const rawPermissions = await getScreenPermissions2(accessToken, tokenType);

          console.log("[Login] Permissions received:", rawPermissions);

          const { mergedPermissions, roles } = mergeAllRolePermissions(rawPermissions || {});

          console.log("[Login] Final merged permissions:", mergedPermissions);
          console.log("[Login] User roles:", roles);

          // Save to Redux
          dispatch(setRolePermissions({ mergedPermissions, roles }));
          dispatch(setEmployeeId(resp.empId));

          await persistor.flush();

          console.log("[Login] All data saved. Navigating to dashboard...");
          navigate("/employee");

        } catch (permError) {
          console.error("[Login] Failed to load permissions:", permError);
          setServerErrors({
            general: "Logged in, but failed to load permissions. Please refresh.",
          });
          // Optionally still navigate or block based on your policy
          // navigate("/scopes"); // Uncomment if you want to proceed anyway
        }
      } else {
        setServerErrors({ general: "Login failed. Please try again." });
      }
    } catch (err) {
      console.error("[Login] Network or unexpected error:", err);
      setServerErrors({ general: "Network error. Please check your connection." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.login_container}>
      <h2 className={styles.login_title}>Employee Portal Login</h2>

      <Formik initialValues={initialValues} validate={validate} onSubmit={handleLoginSubmit}>
        {({ isSubmitting, errors, touched }) => (
          <Form className={styles.loginpageform}>
            <div className={styles.login_form_fields}>
              <div className={styles.field_wrapper}>
                <label htmlFor="emailId" className={styles.label}>Email Id</label>
                <Field
                  id="emailId"
                  name="emailId"
                  type="email"
                  placeholder="Enter Email Id"
                  className={`${styles.input} ${
                    touched.emailId && errors.emailId ? styles.input_error : ""
                  }`}
                />
                <ErrorMessage name="emailId" component="div" className={styles.error} />
              </div>

              <div className={styles.field_wrapper}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter Password"
                  className={`${styles.input} ${
                    touched.password && errors.password ? styles.input_error : ""
                  }`}
                />
                <ErrorMessage name="password" component="div" className={styles.error} />
                {serverErrors.password && <div className={styles.error}>{serverErrors.password}</div>}
              </div>
            </div>

            <div className={styles.login_remember_reset}>
              <label className={styles.checkbox_label}>
                <Field type="checkbox" name="rememberme" />
                <span>Remember Me</span>
              </label>
              <NavLink to="/login/emailrequest" className={styles.resetRoute}>
                Reset Password
              </NavLink>
            </div>

            {serverErrors.general && (
              <div className={styles.login_result}>{serverErrors.general}</div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`${styles.login_button} ${isSubmitting ? styles.loading : styles.proceed}`}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>

      {customErrorType && (
        <div className={styles.loginerror_support}>
          <div className={styles.custom_error}>
            {customErrorType === "deactivated" ? (
              <p>Your account has been deactivated.</p>
            ) : (
              <p>Invalid email or account does not exist.</p>
            )}
          </div>
          <p className={styles.requestLogin}>
            Can't Login?{" "}
            <button type="button" className={styles.fake_link}>
              Request Login
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;