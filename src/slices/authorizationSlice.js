import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  permissions: {},
  roles: [],
  employeeId: null,
};

const authorizationSlice = createSlice({
  name: "authorization",
  initialState,
  reducers: {
    setRolePermissions: (state, action) => {
      const { mergedPermissions = {}, roles = [] } = action.payload || {};
      state.permissions = mergedPermissions;
      state.roles = roles;
    },
    setEmployeeId: (state, action) => {
      state.employeeId = action.payload ?? null;
    },
    logout: (state) => {
      state.permissions = {};
      state.roles = [];
      state.employeeId = null;
    },
  },
});

// ← FIXED: Added spaces after commas
export const { setRolePermissions, setEmployeeId, logout } = authorizationSlice.actions;

export default authorizationSlice.reducer;