// src/components/ReduxState.js
import React from "react";
import { useSelector } from "react-redux";

const ReduxState = () => {
  const state = useSelector((state) => state);

  return (
    <div style={{ position: "fixed", bottom: 10, right: 10, background: "white", padding: 10, border: "1px solid black", maxWidth: "400px", maxHeight: "300px", overflow: "auto", zIndex: 9999 }}>
      <h4>Redux State</h4>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
};

export default ReduxState;