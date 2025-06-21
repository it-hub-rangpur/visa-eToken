import { Box, Grid } from "@mui/material";
import React from "react";
import { IApplication } from "@/lib/apis/Application/ApplicationSlice";
import dynamic from "next/dynamic";

const ProcessCard = dynamic(() => import("./_components/ProcessCard"));
const getProcessApplication = async (): Promise<IApplication[]> => {
  try {
    // Use relative URL
    const res = await fetch(
      `${"http://localhost:3000"}/api/process-applications`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Remove revalidate for SSR
        cache: "no-store", // or "force-cache" if you want runtime caching
      }
    );

    const data = await res.json();
    return data?.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const ProcessPage = async () => {
  const data = await getProcessApplication();

  return (
    <Box sx={{ padding: "1rem" }}>
      <Grid container spacing={2}>
        {data?.map((item, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <ProcessCard data={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProcessPage;
