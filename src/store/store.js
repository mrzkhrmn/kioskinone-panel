import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import loadingReducer from "./slices/loadingSlice";
import loadingMiddleware from "./middleware/loadingMiddleware";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    loading: loadingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware).concat(loadingMiddleware),
});
