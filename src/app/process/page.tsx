import { Box, Grid } from "@mui/material";
import React from "react";
import ProcessCard from "./_components/ProcessCard";
import { IApplication } from "@/lib/apis/Application/ApplicationSlice";

const getProcessApplication = async (): Promise<IApplication[]> => {
  try {
    const res = await fetch("http://localhost:3000/api/process-applications", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const ProcessPage = async () => {
  const data = await getProcessApplication();
  return (
    <Box
      sx={{
        padding: "1rem",
      }}
    >
      <Grid container spacing={2}>
        {data?.map((item, index) => {
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <ProcessCard data={item} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ProcessPage;
