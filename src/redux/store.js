import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authorizationReducer from "../slices/authorizationSlice"; // ← Fixed: import the reducer

const rootReducer = combineReducers({
  authorization: authorizationReducer, // ← Use the reducer, not the slice
});

const persistConfig = { // ← Fixed typo: persistConfig
  key: "root",
  storage,
  whitelist: ["authorization"], // ← Correct: matches the key "authorization"
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);