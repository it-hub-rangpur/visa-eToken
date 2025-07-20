"use client";

import React, { createContext, useContext } from "react";

export interface ILoggedInUser {
  email: string;
  role: string;
  name: string;
  id: string;
  profilePic: string;
  companyId: {
    companyName: string;
    currentBalance: number;
    isActive: boolean;
    tokenAmount: number;
    _id: string;
  };
}

interface GlobalAppStateContextType {
  loggedInUser: ILoggedInUser;
}

const GlobalAppStateContext = createContext<GlobalAppStateContextType | null>(
  null
);

export const useGlobalAppState = () => {
  const context = useContext(GlobalAppStateContext);
  if (!context) {
    throw new Error(
      "useGlobalAppState must be used within the GlobalAppStateProvider"
    );
  }
  return context;
};

const GlobalAppStateProvider: React.FC<{
  children: React.ReactNode;
  loggedInUser: ILoggedInUser;
}> = ({ children, loggedInUser }) => {
  return (
    <GlobalAppStateContext.Provider
      value={{
        loggedInUser,
      }}
    >
      {children}
    </GlobalAppStateContext.Provider>
  );
};

export default GlobalAppStateProvider;
