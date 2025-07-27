"use client";

import { Box, styled, useTheme } from "@mui/material";
import React from "react";
import SideNav from "./__components/SideNav";
import Header from "./__components/Header";

export interface IMenuProps {
  label: string;
  icon?: string;
  icon2?: string;
  link: string;
  subLink: { link: string; label: string }[];
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const theme = useTheme();

  const menuItems: IMenuProps[] = [
    {
      label: "Home",
      icon: "",
      icon2: "",
      link: "/",
      subLink: [],
    },
    {
      label: "Ongoing Applications",
      icon: "",
      icon2: "",
      link: "/ongoing-applications",
      subLink: [],
    },
    {
      label: "Process Dashboard",
      icon: "",
      icon2: "",
      link: "/process",
      subLink: [],
    },
  ];

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

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
      <Box>
        <Box display={{ md: "none" }}>
          <SideNav menuItems={menuItems} setOpen={setOpen} open={open} />
        </Box>
        <Box display={{ xs: "none", md: "block" }}>
          <SideNav menuItems={menuItems} setOpen={setOpen} open={true} />
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
