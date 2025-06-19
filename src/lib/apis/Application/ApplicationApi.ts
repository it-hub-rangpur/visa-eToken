import baseApiSlice from "../BaseApiSlice";

const ApplicationApi = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createSession: builder.mutation({
      query: (data) => ({
        url: `/create-session`,
        method: "POST",
        contentType: "application/json",
        body: data,
      }),
      //   invalidatesTags: ["user"],
    }),

    abortCall: builder.mutation({
      query: (data) => ({
        url: `/abort`,
        method: "POST",
        contentType: "application/json",
        body: data,
      }),
      //   invalidatesTags: ["user"],
    }),

    // generateOtp: builder.mutation({
    //   query: ({ params, ...data }) => ({
    //     url: `/generateOtp`,
    //     method: "POST",
    //     contentType: "multipart/form-data",
    //     data,
    //     params,
    //   }),
    //   invalidatesTags: ["user"],
    // }),

    // validateOtp: builder.mutation({
    //   query: (data) => ({
    //     url: `/ValidateOtp`,
    //     method: "POST",
    //     contentType: "multipart/form-data",
    //     data,
    //   }),
    //   invalidatesTags: ["user"],
    // }),

    // updateUserName: builder.mutation({
    //   query: ({ data, id }) => ({
    //     url: `/userProfile/${id}`,
    //     method: "PUT",
    //     contentType: "multipart/form-data",
    //     data,
    //   }),
    //   invalidatesTags: ["user"],
    // }),
    // loginWithMagicLink: builder.query({
    //   query: (token) => ({
    //     url: `/validateMagicLink/${token}`,
    //     method: "GET",
    //   }),
    //   providesTags: ["user"],
    // }),
  }),
});

export const { useCreateSessionMutation, useAbortCallMutation } =
  ApplicationApi;
