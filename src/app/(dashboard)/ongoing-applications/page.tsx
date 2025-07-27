import { Box, Typography } from "@mui/material";
import { headers } from "next/headers";
import React from "react";
import ApplicationTable from "../__components/ApplicationTable";
import { IApplication } from "@/interfaces/clientInterfaces";

const getApplications = async () => {
  const cookie = (await headers()).get("cookie");

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v2/get-applications",
      {
        method: "GET",
        headers: {
          cookie: cookie ?? "",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const OngoingApplications = async () => {
  const applications = await getApplications();

  return (
    <Box sx={{ paddingX: "20px" }}>
      <Box>
        <Typography sx={{ fontSize: "1.5rem", fontWeight: 600 }}>
          Ongoing Applications - {applications.length}
        </Typography>
      </Box>

      <Box sx={{ marginTop: "1.5rem" }}>
        <ApplicationTable allApplications={applications as IApplication[]} />
      </Box>
    </Box>
  );
};

export default OngoingApplications;
