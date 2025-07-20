"use client";
import React from "react";
import { styled, alpha, useTheme } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  Avatar,
  Button,
  Menu,
  Divider,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import { MenuProps } from "@mui/material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { IMenuProps } from "../..";
import { Logout } from "@mui/icons-material";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 200,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "5px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette?.text?.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

interface HeaderProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  // setLogoutModal: React.Dispatch<React.SetStateAction<boolean>>;
  menuItems: IMenuProps[];
}

const Header: React.FC<HeaderProps> = ({
  setOpen,
  open,
  // setLogoutModal,
  menuItems,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // const { user } = useAppSelector((state) => state.supplyAuth);

  const user = {
    name: "Arnifii",
    image: "/images/profile.png",
  };

  // const navigateWithScroll = useScrollToTopOnNavigate();

  const logoutHandlar = (): void => {
    // setLogoutModal(true);
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        paddingX: "2%",
        flexGrow: 1,
        marginBottom: { xs: "80px", md: "16px" },
        bgcolor: "#FCFCFC",
        borderBottom: `1px solid rgba(0, 0, 0, 0.12)`,
      }}
    >
      <AppBar
        sx={{
          position: "fixed",
          // paddingY: "16px",
          boxShadow: "0px 20px 51px 0px rgba(66, 129, 233, 0.20)",
          [theme.breakpoints.up("md")]: {
            position: "static",
            bgcolor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <Toolbar>
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
            }}
            justifyContent="center"
            alignItems="center"
          >
            <IconButton
              onClick={() => setOpen(!open)}
              size="large"
              aria-label="menu"
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          <Box display="flex" justifyContent={"center"} alignItems={"center"}>
            <Box display={{ xs: "none", md: "flex" }}>
              <Avatar
                alt={user?.name}
                src=""
                sx={{ width: 40, height: 40, mx: "10px" }}
              />

              <Box>
                {/* <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ ml: "5px", fontWeight: 400, color: "#757575" }}
                >
                  Welcome
                </Typography> */}
                <Button
                  aria-haspopup="true"
                  aria-expanded={true}
                  variant="text"
                  disableElevation
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{
                    color: theme.palette?.secondary.main,
                    fontSize: "16px",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  {user?.name}
                </Button>
              </Box>
            </Box>

            <Box
              display={{ xs: "flex", md: "none" }}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar
                  alt={user?.name}
                  src=""
                  sx={{ width: 40, height: 40, cursor: "pointer" }}
                />
              </IconButton>
            </Box>

            <StyledMenu
              disableScrollLock
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              {menuItems?.map((item, i) => (
                <MenuItem
                  key={i}
                  onClick={() => {
                    // navigateWithScroll(item?.link);
                    setAnchorEl(null);
                  }}
                  disableRipple
                >
                  {item?.icon}
                  <Typography
                    sx={{ color: "#3A326D", fontWeight: 500, px: "10px" }}
                  >
                    {item?.label}
                  </Typography>
                </MenuItem>
              ))}
              <Divider />

              <MenuItem disableRipple onClick={logoutHandlar}>
                {/* <Image
                  src={ILogout}
                  alt="logout"
                  height={20}
                  width={20}
                  title="logout"
                /> */}
                <Logout />
                <Typography
                  sx={{ color: "#3A326D", fontWeight: 500, px: "10px" }}
                >
                  {"Logout"}
                </Typography>
              </MenuItem>
            </StyledMenu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
