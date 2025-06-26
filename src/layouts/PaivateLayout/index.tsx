"use client";

import { useGetLoginUserQuery } from "@/lib/apis/server/serverApi";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useGetLoginUserQuery(undefined);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && data?.data?.role !== "superadmin") {
      router.replace("/login");
    }
  }, [isLoading, data, router]);

  if (isLoading) {
    return (
      <Box>
        <Typography>Loading....</Typography>
      </Box>
    );
  }

  // Show nothing while redirecting (not superadmin)
  if (data?.data?.role !== "superadmin") {
    return null;
  }

  return <Box>{children}</Box>;
};

export default PrivateLayout;
