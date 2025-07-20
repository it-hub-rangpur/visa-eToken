"use client";

import { Box, styled, useTheme } from "@mui/material";
import React from "react";
import SideNav from "./components/SideNav";
import Header from "./components/Header";
import { Dashboard, LocationCity, PostAdd } from "@mui/icons-material";

export interface IMenuProps {
  label: string;
  icon: React.ReactElement | null;
  icon2?: React.ReactElement | null;
  link: string;
  subLink: { link: string; label: string }[];
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const theme = useTheme();

  const Main = styled("main")<{
    open?: boolean;
  }>(({}) => ({
    minHeight: "100vh",
    width: "100%",
    flexGrow: 1,
    padding: theme.spacing(0),
    background: "transparent",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${0}px`,
    [theme.breakpoints.up("md")]: {
      marginLeft: "0px",
    },
  }));

  const menuItems: IMenuProps[] = [
    {
      label: "Dashboard",
      icon: <Dashboard />,
      icon2: <Dashboard sx={{ color: "primary.main" }} />,
      link: "/",
      subLink: [],
    },

    {
      label: "Agents",
      icon: <LocationCity />,
      icon2: <LocationCity sx={{ color: "primary.main" }} />,
      link: "/admin/agents",
      subLink: [],
    },
    {
      label: "Applications",
      icon: <PostAdd />,
      icon2: <PostAdd sx={{ color: "primary.main" }} />,
      link: "/applications",
      subLink: [],
    },
  ];

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
      <Box>
        <Box display={{ md: "none" }}>
          <SideNav
            menuItems={menuItems}
            logo={
              "https://arnifi.com/_next/static/media/Arnifi%20Primary%20Logo_Blue.8fc3f7c3.svg"
            }
            setOpen={setOpen}
            open={open}
          />
        </Box>
        <Box display={{ xs: "none", md: "block" }}>
          <SideNav
            menuItems={menuItems}
            logo={
              "https://arnifi.com/_next/static/media/Arnifi%20Primary%20Logo_Blue.8fc3f7c3.svg"
            }
            setOpen={setOpen}
            open={true}
          />
        </Box>
      </Box>

      <Main>
        <Header menuItems={menuItems} setOpen={setOpen} open={open} />
        {children}
      </Main>
    </Box>
  );
};

export default DashboardLayout;
