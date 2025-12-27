import React, { useState } from "react";
import { encryptPassword } from "../utils/passwordEncrypt";
import { useDispatch } from "react-redux";
import { setRolePermissions } from "../slices/authorizationSlice";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {

      // 1. Encrypt the password
      const encryptedPassword = encryptPassword(password);
      console.log("Encrypted Password:", encryptedPassword);

      // 2. Call the real backend API
      const response = await fetch("http://localhost:8081/sc/emp/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username.trim(),        // assuming backend expects "email"
          password: encryptedPassword,   // send encrypted password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success!
        setMessage(data.message || "Login successful!");
        setMessageType("success");
        console.log("Login Success:", data);
        let mergedPermissions={};
        let roles=[];
        
        // Optional: Save token if returned
        if (data.token) {
          localStorage.setItem("jwtToken", data.token);
        }


        if (data.permissions) {
          mergedPermissions = data.permissions;
        }
        if (data.roles) {
          roles = data.roles;
        }




        if (data.token) {
          try {
            const decoded = jwtDecode(data.token); // You may need to install jwt-decode
            console.log("Decoded Token:", decoded);

            mergedPermissions = decoded.screenPermissions || decoded.permissions || {};
            roles = decoded.roles || [decoded.role] || [];
          } catch (err) {
            console.warn("Could not decode token", err);
          }
        }
        dispatch(setRolePermissions({
          mergedPermissions,
          roles
        }));
        navigate("/dashboard");

        // TODO: Redirect to dashboard or dispatch to Redux
        // navigate("/dashboard");
      } else {
        // Backend returned error
        setMessage(data.message || "Invalid username or password");
        setMessageType("error");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setMessage("Network error or server not reachable. Check if backend is running on port 8081.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "60px auto",
        padding: "40px",
        border: "1px solid #ccc",
        borderRadius: "12px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        backgroundColor: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
        Employee Login
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Email
          </label>
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="emp412@test.com"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #aaa",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #aaa",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: loading ? "#95a5a6" : "#2980b9",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {message && (
        <div
          style={{
            marginTop: "25px",
            padding: "15px",
            borderRadius: "6px",
            textAlign: "center",
            fontWeight: "bold",
            backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
            color: messageType === "success" ? "#155724" : "#721c24",
            border: `1px solid ${messageType === "success" ? "#c3e6cb" : "#f5c6cb"}`,
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default LoginForm;