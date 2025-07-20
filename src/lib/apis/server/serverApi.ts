import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { setLoggedInUser } from "./serverSlice";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

const serverApiSlice = createApi({
  reducerPath: "serverApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/v2`,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      const cookies = document.cookie.split("; ");
      const tokenCookie = cookies.find((row) => row.startsWith("token="));
      const token = tokenCookie ? tokenCookie.split("=")[1] : null;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
    credentials: "include",
  }),

  tagTypes: ["user"],
  endpoints: (builder) => ({
    getCaptcha: builder.mutation({
      query: () => ({
        url: `/get-captcha-token`,
        method: "GET",
        contentType: "application/json",
      }),
    }),

    userLogin: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
        contentType: "application/json",
      }),
      invalidatesTags: ["user"],
    }),

    getLoginUser: builder.query({
      query: () => ({
        url: "/api/v1/get-login-info",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.success) {
            dispatch(setLoggedInUser(data?.data));
          }
        } catch (err) {
          console.error(err);
        }
      },
      providesTags: ["user"],
    }),
  }),
});

export const {
  useGetCaptchaMutation,
  useUserLoginMutation,
  useGetLoginUserQuery,
} = serverApiSlice;
export default serverApiSlice;
