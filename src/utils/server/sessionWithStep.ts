// Create a string enum for session steps
export const SessionSteps = {
  SESSION_CREATED: "session-created",
  LOGIN_SUCCESSFUL: "login-successful",
  APPLICATION_INFO: "application-info",
  PERSONAL_INFO: "personal-info",
  OVERVIEW: "overview",
  PAYMENTOTP: "payment-otp",
  VERIFYPAYMENTOTP: "verify-payment-otp",
  GETTIMESLOT: "get-time-slot",
  BOOKNOW: "book-now",
} as const;

export type SessionStep = (typeof SessionSteps)[keyof typeof SessionSteps];

const serverSession: Record<SessionStep, number> = {
  [SessionSteps.SESSION_CREATED]: 1,
  [SessionSteps.LOGIN_SUCCESSFUL]: 2,
  [SessionSteps.APPLICATION_INFO]: 3,
  [SessionSteps.PERSONAL_INFO]: 4,
  [SessionSteps.OVERVIEW]: 5,
  [SessionSteps.PAYMENTOTP]: 6,
  [SessionSteps.VERIFYPAYMENTOTP]: 7,
  [SessionSteps.GETTIMESLOT]: 8,
  [SessionSteps.BOOKNOW]: 9,
};

export const getCurrentSession = (current: SessionStep) => {
  return serverSession[current] ?? 0;
};
