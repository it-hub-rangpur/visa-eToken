"use client";

import HeaderText from "@/components/HeaderText";
import { Box, Button, Tab, Tabs } from "@mui/material";
import React from "react";
import AllAgents from "./__components/AllAgents";
import AllUsers from "./__components/AllUsers";

const Agents = () => {
  const [value, setValue] = React.useState(0);
  const [applicationModalOpen, setApplicationModalOpen] = React.useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabItems = [
    { label: "Agents list", component: <AllAgents /> },
    { label: "Users list", component: <AllUsers /> },
  ];

  const handleApplicationModalOpen = () => {
    setApplicationModalOpen(true);
  };

  return (
    <Box sx={{ paddingX: "2rem" }}>
      <HeaderText heading="Agents" />
      {/* <Box sx={{ paddingY: "1rem", display: "flex", justifyContent: "end" }}>
        <Link href={"/admin/agents/create"}>
          <Button
            color="primary"
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Add Agent
          </Button>
        </Link>
      </Box> */}

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
            +Add Agent
          </Button>
        ) : (
          <Button
            onClick={handleApplicationModalOpen}
            size="small"
            variant="contained"
            color="primary"
            sx={{
              textTransform: "none",
            }}
          >
            +Add User
          </Button>
        )}
      </Box>

      <Box>{tabItems[value]?.component}</Box>
    </Box>
  );
};

export default Agents;
