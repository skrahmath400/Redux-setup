// utils/permissionUtils.js
import { SCREEN_KEY_MAP } from "../constants/screenConstants";

// Merge permissions from backend data
export const mergeAllRolePermissions = (rolesPermissions = {}) => {
  const mergedScreens = {}; // screen_name → { view: true, create: true, update: true, all: true }
  const extractedRoles = [];

  for (const role in rolesPermissions) {
    extractedRoles.push(role);

    rolesPermissions[role].forEach(({ screen_name, permission_name }) => {
      if (!mergedScreens[screen_name]) {
        mergedScreens[screen_name] = { view: false, create: false, update: false, all: false };
      }
      if (permission_name === 'v') mergedScreens[screen_name].view = true;
      if (permission_name === 'create') mergedScreens[screen_name].create = true;
      if (permission_name === 'update') mergedScreens[screen_name].update = true;
      if (permission_name === 'all') mergedScreens[screen_name].all = true;
    });
  }

  const finalPermissions = {};
  Object.entries(mergedScreens).forEach(([backendScreen, perms]) => {
    const mappedKey = SCREEN_KEY_MAP[backendScreen] || backendScreen.toUpperCase().replace(/-/g, '_');
    finalPermissions[mappedKey] = perms;
  });

  return {
    mergedPermissions: finalPermissions,
    roles: extractedRoles,
  };
};

// Check access for a screen
export const checkAccess = (permissions, screenKey) => {
  const perms = permissions?.[screenKey] || {};
  return {
    canView: perms.view || perms.all,
    canCreate: perms.create || perms.all,
    canUpdate: perms.update || perms.all,
    hasAll: perms.all,
  };
};