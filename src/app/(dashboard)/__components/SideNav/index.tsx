"use client";
import React from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
} from "@mui/material";

import { styled, useTheme } from "@mui/material/styles";
import { usePathname, useRouter } from "next/navigation";
import { IMenuProps } from "../../layout";
import { Close, Logout } from "@mui/icons-material";
import { useGlobalAppState } from "@/context/GlobalAppStateContext";
import Link from "next/link";

interface SideNavProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  menuItems: IMenuProps[];
}

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 3),
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
}));

const SideNav: React.FC<SideNavProps> = ({ setOpen, open, menuItems }) => {
  const { loggedInUser } = useGlobalAppState();
  const companyName = loggedInUser?.companyId?.companyName;
  const router = useRouter();
  const theme = useTheme();
  const pathName = usePathname();

  return (
    <Drawer
      sx={{
        width: "100%",
        "& .MuiDrawer-paper": {
          width: "300px",
          boxSizing: "border-box",
          "@media (min-width: 900px)": {
            width: "300px",
          },
        },
        "@media (min-width: 900px)": {
          width: "300px",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <Link href={"/"}>
          <Typography
            sx={{
              fontSize: "22px",
              fontWeight: 600,
            }}
          >
            {companyName?.slice(0, 10)}
          </Typography>
        </Link>

        <IconButton
          sx={{
            display: { xs: "block", md: "none" },
            height: "50px",
            width: "50px",
          }}
          onClick={() => setOpen(!open)}
        >
          <Close />
        </IconButton>
      </DrawerHeader>

      <Box
        display="flex"
        justifyContent={"space-between"}
        flexDirection={"column"}
        sx={{
          height: "100%",
          padding: "20px",
        }}
      >
        <List>
          {menuItems.map((menuItem, index) => (
            <React.Fragment key={index}>
              <ListItemButton
                onClick={() => {
                  router.push(menuItem?.link);
                  setOpen(false);
                }}
                sx={{
                  borderRadius: "10px",

                  bgcolor:
                    (menuItem?.link === "/" && pathName === "/") ||
                    (menuItem?.link !== "/" &&
                      pathName.startsWith(menuItem?.link))
                      ? "#EBEBFF"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "#EBEBFF",
                  },
                }}
              >
                <ListItemIcon>
                  {(menuItem?.link === "/" && pathName === "/") ||
                  (menuItem?.link !== "/" &&
                    pathName.startsWith(menuItem?.link))
                    ? menuItem?.icon2 ?? menuItem?.icon2
                    : menuItem?.icon}
                </ListItemIcon>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ width: "100%", py: "5px", marginLeft: "-15px" }}
                >
                  <Typography
                    sx={{
                      color:
                        (menuItem?.link === "/" && pathName === "/") ||
                        (menuItem?.link !== "/" &&
                          pathName.startsWith(menuItem?.link))
                          ? "#3939CC"
                          : "#3A326D",
                      fontWeight: menuItem.link === pathName ? 500 : 400,
                    }}
                  >
                    {menuItem.label}
                  </Typography>
                </Box>
              </ListItemButton>
            </React.Fragment>
          ))}
        </List>

        <List>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: theme.palette.info.main,
                },
              }}
            >
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: "100%", py: "5px" }}
              >
                <Typography sx={{ color: "#3A326D", fontWeight: 500 }}>
                  {"Logout"}
                </Typography>
              </Box>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default SideNav;
