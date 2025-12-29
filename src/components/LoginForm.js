// src/components/LoginForm.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { mergeAllRolePermissions } from "../utils/permissionUtils";
import {
  setRolePermissions,
  setEmployeeId,
} from "../slices/authorizationSlice";
import { persistor } from "../redux/store";

// API URLs — KEPT EXACTLY AS YOU PROVIDED
const LOGIN_URL = "http://localhost:8081/sc/emp/login";
const AUTH_URL = "http://localhost:9000/api/common/auth/token";

// ==================== YOUR EXACT PASSWORD ENCRYPTION ====================
const PRE_SHARED_KEY_B64 = "R42FYg7zESO28+PZ7mIZte8H5ZiN6Fw5uQHWgcPqHko=";
const NUM_CHARS = 1;

function asciiToBytes(str) {
  const out = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) out[i] = str.charCodeAt(i);
  return out;
}

function concatBytes(...parts) {
  let total = 0;
  for (const p of parts) total += p.length;
  const out = new Uint8Array(total);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

function bytesToBase64(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

function aesEncryptToBase64(plaintext) {
  const key = CryptoJS.enc.Base64.parse(PRE_SHARED_KEY_B64);
  const pt = CryptoJS.enc.Utf8.parse(plaintext);
  const encrypted = CryptoJS.AES.encrypt(pt, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

function encryptPassword(plaintext) {
  const base64 = aesEncryptToBase64(plaintext);

  const padCount = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  const maxCut = base64.length - padCount - NUM_CHARS;

  if (maxCut < 0) {
    throw new Error("Password too short for encryption");
  }

  let cutIndex = Math.min(16, maxCut);

  const removed = base64.slice(cutIndex, cutIndex + NUM_CHARS);
  const modified = base64.slice(0, cutIndex) + base64.slice(cutIndex + NUM_CHARS);

  const cutIndexByte = new Uint8Array([cutIndex & 0xff]);
  const payloadBytes = concatBytes(cutIndexByte, asciiToBytes(modified), asciiToBytes(removed));

  return bytesToBase64(payloadBytes);
}
// =========================================================================

// Direct API calls
const loginSubmit = async (payload) => {
  const response = await axios.post(LOGIN_URL, payload);
  return response.data;
};

const getScreenPermissions2 = async (accessToken, tokenType = "Bearer") => {
  const response = await axios.get(AUTH_URL, {
    headers: { Authorization: `${tokenType} ${accessToken}` },
  });
  return response.data;
};

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
    if (!values.emailId) errors.emailId = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailId))
      errors.emailId = "Invalid email format";

    if (!values.password) errors.password = "Password is required";
    else if (values.password.length < 6)
      errors.password = "Password must be at least 6 characters";

    return errors;
  };

  // const handleLoginSubmit = async (values, { setSubmitting }) => {
  //   setCustomErrorType(null);
  //   setServerErrors({ emailId: null, password: null, general: null });

  //   try {
  //     console.log("[Login] Starting login for:", values.emailId);

  //     // Encrypt password
  //     const encryptedPassword = encryptPassword(values.password);
  //     console.log("[Login] Password encrypted");

  //     const payload = { emailId: values.emailId, password: encryptedPassword };
  //     console.log("[Login] Sending payload to backend");

  //     // Call login API
  //     const resp = await loginSubmit(payload);
  //     console.log("[Login] Backend response:", resp);

  //     // Handle known error messages
  //     const ERROR_MAP = {
  //       "Password Incorrect": () => ({ password: "Incorrect password" }),
  //       "User is not active": () => {
  //         setCustomErrorType("deactivated");
  //         return {};
  //       },
  //       "Email is not existed": () => {
  //         setCustomErrorType("invalid");
  //         return {};
  //       },
  //     };

  //     const reason = resp?.reason;
  //     if (reason && ERROR_MAP[reason]) {
  //       setServerErrors(ERROR_MAP[reason]());
  //       return;
  //     }

  //     // Success path
  //     if (resp && (resp.isLoginSuccess || resp.loginSuccess)) {
  //       console.log("[Login] Login successful");

  //       const accessToken = resp?.jwt?.accessToken;
  //       const type = resp?.jwt?.tokenType || "Bearer";

  //       if (!accessToken) throw new Error("No access token received");

  //       // Save token
  //       localStorage.setItem("authToken", accessToken);
  //       localStorage.setItem("authTokenType", type);

  //       // Fetch permissions
  //       const rawPermissions = await getScreenPermissions2(accessToken, type);
  //       console.log("[Login] Raw permissions:", rawPermissions);

  //       const { mergedPermissions, roles } = mergeAllRolePermissions(rawPermissions);
  //       console.log("[Login] Merged permissions:", mergedPermissions);
  //       console.log("[Login] Roles:", roles);

  //       // Save to Redux
  //       dispatch(setRolePermissions({ mergedPermissions, roles }));
  //       if (resp?.empId) dispatch(setEmployeeId(resp.empId));

  //       await persistor.flush();

  //       // Save user info
  //       localStorage.setItem("empName", resp?.empName || "");
  //       localStorage.setItem("empId", String(resp?.empId || ""));
  //       localStorage.setItem("designation", resp?.designation || "");
  //       localStorage.setItem("category", resp?.category || "");
  //       localStorage.setItem("campusName", resp?.campusName || "");
  //       localStorage.setItem("campusCategory", resp?.campusCategory || "");

  //       console.log("[Login] Redirecting to /scopes");
  //       navigate("/scopes");
  //     } else {
  //       setServerErrors({ general: resp?.reason || "Login failed. Please try again." });
  //     }
  //   } catch (err) {
  //     console.error("[Login] Error:", err);
  //     setServerErrors({ general: err.message || "Network error. Please try again." });
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };
const handleLoginSubmit = async (values, { setSubmitting }) => {
  setCustomErrorType(null);
  setServerErrors({ emailId: null, password: null, general: null });

  try {
    const encryptedPassword = encryptPassword(values.password);

    const payload = {
      email: values.emailId.trim(),     // ← Critical fix
      password: encryptedPassword,
    };

    console.log("[Login] Sending correct payload:", payload);

    const resp = await loginSubmit(payload);

    // Rest of your code...
  } catch (err) {
    // ...
  }
};
  return (
    <div style={{
      maxWidth: "420px",
      margin: "100px auto",
      padding: "40px",
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#2c3e50" }}>
        Employee Portal Login
      </h2>

      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleLoginSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                Email Address
              </label>
              <Field
                type="email"
                name="emailId"
                placeholder="emp412@company.com"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  border: "1px solid #bdc3c7",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
              <ErrorMessage
                name="emailId"
                component="div"
                style={{ color: "#e74c3c", fontSize: "14px", marginTop: "6px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                Password
              </label>
              <Field
                type="password"
                name="password"
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  border: "1px solid #bdc3c7",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
              <ErrorMessage
                name="password"
                component="div"
                style={{ color: "#e74c3c", fontSize: "14px", marginTop: "6px" }}
              />
              {serverErrors.password && (
                <div style={{ color: "#e74c3c", fontSize: "14px", marginTop: "6px" }}>
                  {serverErrors.password}
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <label>
                <Field type="checkbox" name="rememberme" />
                <span style={{ marginLeft: "8px" }}>Remember Me</span>
              </label>
              <a href="/login/emailrequest" style={{ color: "#3498db", textDecoration: "none" }}>
                Reset Password
              </a>
            </div>

            {serverErrors.general && (
              <div style={{ color: "#e74c3c", textAlign: "center", fontSize: "14px" }}>
                {serverErrors.general}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "14px",
                backgroundColor: isSubmitting ? "#95a5a6" : "#3498db",
                color: "white",
                fontSize: "18px",
                fontWeight: "600",
                border: "none",
                borderRadius: "8px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>

      {customErrorType && (
        <div style={{ marginTop: "30px", textAlign: "center", color: "#e74c3c" }}>
          <p>
            User account is {customErrorType === "deactivated" ? "deactivated" : "invalid"}.
          </p>
          <p>Can't Login? <a href="#">Request Login</a></p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;