import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
// const backendUrl: string = process.env.NEXT_PUBLIC_BASE_URL as string;

const baseApiSlice = createApi({
  reducerPath: "baseApiSlice",
  baseQuery: fetchBaseQuery({ baseUrl: "/api", credentials: "include" }),
  tagTypes: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endpoints: (builder) => ({}),
});

export default baseApiSlice;
