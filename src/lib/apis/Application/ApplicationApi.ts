import baseApiSlice from "../BaseApiSlice";

const ApplicationApi = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createSession: builder.mutation({
      query: ({ info }) => ({
        url: `/create-session`,
        method: "POST",
        contentType: "application/json",
        body: info,
      }),
    }),

    abortCall: builder.mutation({
      query: (data) => ({
        url: `/abort`,
        method: "POST",
        contentType: "application/json",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: ({ info }) => ({
        url: `/login`,
        method: "POST",
        contentType: "application/json",
        body: info,
      }),
    }),
  }),
});

export const {
  useCreateSessionMutation,
  useAbortCallMutation,
  useLoginMutation,
} = ApplicationApi;
