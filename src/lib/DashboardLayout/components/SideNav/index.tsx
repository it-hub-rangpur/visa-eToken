"use client";
import React, { useState } from "react";
import {
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
} from "@mui/material";

import { styled, useTheme } from "@mui/material/styles";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { IMenuProps } from "../..";
import { Close, Logout } from "@mui/icons-material";

interface SideNavProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  logo: string;
  menuItems: IMenuProps[];
}

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 3),
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
}));

const SideNav: React.FC<SideNavProps> = ({
  setOpen,
  open,
  logo,
  menuItems,
}) => {
  const theme = useTheme();
  const [collapse, setCollapse] = useState<{ [index: number]: boolean }>({});
  const pathName = usePathname();
  const router = useRouter();

  const handleClick = (index: number): void => {
    setCollapse((prevCollapes) => ({
      ...prevCollapes,
      [index]: !prevCollapes[index],
    }));
  };

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
          <Image
            alt="logo"
            title="logo"
            src={logo}
            width={120}
            height={34}
            style={{
              marginLeft: "7px",
              marginTop: "30px",
              marginBottom: "20px",
            }}
          />
        </Link>

        <IconButton
          color="error"
          sx={{
            display: { xs: "block", md: "none" },
            cursor: "pointer",
            height: "40px",
            width: "40px",
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
              <ListItem disablePadding>
                {menuItem?.subLink?.length > 0 ? (
                  <ListItemButton
                    onClick={() => {
                      router.push(menuItem?.link);
                      setOpen(false);
                      handleClick(index);
                    }}
                    sx={{
                      borderRadius: "10px",
                    }}
                  >
                    <ListItemIcon>
                      {pathName.includes(menuItem?.link)
                        ? menuItem.icon2
                        : menuItem.icon}
                    </ListItemIcon>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ width: "100%", py: "5px", marginLeft: "-15px" }}
                    >
                      <Typography
                        sx={{
                          color: pathName.includes(menuItem?.link)
                            ? "primary.main"
                            : "#3A326D",
                          fontWeight: 500,
                        }}
                      >
                        {menuItem.label}
                      </Typography>
                      {menuItem?.subLink?.length > 0 &&
                        (collapse[index] ? <ExpandMore /> : <ExpandLess />)}
                    </Box>
                  </ListItemButton>
                ) : (
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
                              ? "primary.main"
                              : "#3A326D",
                          fontWeight: menuItem.link === pathName ? 600 : 500,
                        }}
                      >
                        {menuItem.label}
                      </Typography>
                    </Box>
                  </ListItemButton>
                )}
              </ListItem>
              {menuItem.subLink.length > 0 && (
                <Collapse in={collapse[index]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {menuItem.subLink.map((subItem, subIndex) => (
                      <ListItem key={subIndex} disablePadding>
                        <ListItemButton
                          onClick={() => router.push(subItem?.link)}
                          sx={{
                            pl: 6,
                            borderRadius: "10px",
                            backgroundColor:
                              pathName === subItem?.link
                                ? "#EBEBFF"
                                : "transparent",
                            "&:hover": {
                              backgroundColor: theme.palette.info.main,
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              color:
                                pathName === subItem?.link
                                  ? "primary.main"
                                  : "#3A326D",
                              fontWeight: 500,
                            }}
                          >
                            {subItem.label}
                          </Typography>
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>

        <List>
          <ListItem disablePadding>
            <ListItemButton
              color="error"
              sx={{
                borderRadius: "10px",
              }}
            >
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              Logout
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default SideNav;
