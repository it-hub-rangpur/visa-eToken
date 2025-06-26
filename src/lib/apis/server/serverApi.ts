import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { setLoggedInUser } from "./serverSlice";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL as string;

const serverApiSlice = createApi({
  reducerPath: "serverApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/v1`,
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
        url: `/recaptcha-token/anti`,
        method: "GET",
        contentType: "application/json",
      }),
    }),

    userLogin: builder.mutation({
      query: (data) => ({
        url: "/users/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),

    getLoginUser: builder.query({
      query: () => ({
        url: "/users/me",
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
