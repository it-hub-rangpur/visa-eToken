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
    applicationInfo: builder.mutation({
      query: ({ info }) => ({
        url: `/application-info`,
        method: "POST",
        contentType: "application/json",
        body: info,
      }),
    }),
    personalInfo: builder.mutation({
      query: ({ info }) => ({
        url: `/personal-info`,
        method: "POST",
        contentType: "application/json",
        body: info,
      }),
    }),

    overviewInfo: builder.mutation({
      query: ({ info }) => ({
        url: `/overview-info`,
        method: "POST",
        contentType: "application/json",
        body: info,
      }),
    }),

    paymentOtp: builder.mutation({
      query: ({ info }) => ({
        url: `/payment-otp`,
        method: "POST",
        contentType: "application/json",
        body: info,
      }),
    }),

    otpVerify: builder.mutation({
      query: ({ info }) => ({
        url: `/verify-otp`,
        method: "POST",
        contentType: "application/json",
        body: info,
      }),
    }),

    getTimeSlot: builder.mutation({
      query: ({ info }) => ({
        url: `/get-time-slot`,
        method: "POST",
        contentType: "application/json",
        body: info,
      }),
    }),

    bookSlot: builder.mutation({
      query: ({ info }) => ({
        url: `/book-now`,
        method: "POST",
        contentType: "application/json",
        body: info,
      }),
    }),

    orderConfirm: builder.mutation({
      query: (orderInfo) => ({
        url: `/order-confirmations`,
        method: "POST",
        contentType: "application/json",
        body: orderInfo,
      }),
    }),
  }),
});

export const {
  useCreateSessionMutation,
  useAbortCallMutation,
  useLoginMutation,
  useApplicationInfoMutation,
  usePersonalInfoMutation,
  useOverviewInfoMutation,
  usePaymentOtpMutation,
  useOtpVerifyMutation,
  useGetTimeSlotMutation,
  useBookSlotMutation,
  useOrderConfirmMutation,
} = ApplicationApi;
