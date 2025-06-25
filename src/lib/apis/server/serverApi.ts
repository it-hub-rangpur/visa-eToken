import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

const serverApiSlice = createApi({
  reducerPath: "serverApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1`,
    credentials: "include",
  }),

  tagTypes: [],
  endpoints: (builder) => ({
    getCaptcha: builder.mutation({
      query: () => ({
        url: `/recaptcha-token/anti`,
        method: "GET",
        contentType: "application/json",
      }),
    }),
  }),
});

export const { useGetCaptchaMutation } = serverApiSlice;
export default serverApiSlice;
