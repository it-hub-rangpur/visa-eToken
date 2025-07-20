"use client";

import HeaderText from "@/components/HeaderText";
import { Box, Button, Tab, Tabs } from "@mui/material";
import React from "react";
import AllApplication from "./__components/AllApplication";
import OngoingComponent from "./__components/Ongoing";
import ApplicationModal from "@/components/Modals/ApplicationModal";

const Application = () => {
  const [value, setValue] = React.useState(0);
  const [applicationModalOpen, setApplicationModalOpen] = React.useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabItems = [
    { label: "All Applications", component: <AllApplication /> },
    { label: "Onprogress Applications", component: <OngoingComponent /> },
  ];

  const handleApplicationModalOpen = () => {
    setApplicationModalOpen(true);
  };

  return (
    <Box sx={{ paddingX: "2rem" }}>
      <HeaderText heading="Applications" />

      <Box
        sx={{
          marginY: "1rem",
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tabs value={value} onChange={handleChange}>
          {tabItems?.map((item, i) => {
            return (
              <Tab sx={{ textTransform: "none" }} key={i} label={item?.label} />
            );
          })}
        </Tabs>

        {value === 0 ? (
          <Button
            onClick={handleApplicationModalOpen}
            size="small"
            variant="contained"
            color="primary"
            sx={{
              textTransform: "none",
            }}
          >
            +Add Application
          </Button>
        ) : (
          ""
        )}
      </Box>

      <Box>{tabItems[value]?.component}</Box>

      <ApplicationModal
        open={applicationModalOpen}
        setOpen={setApplicationModalOpen}
      />
    </Box>
  );
};

export default Application;
