import { Box } from "@mui/material";
import { headers } from "next/headers";
import React from "react";

const getLoginInfo = async () => {
  const cookie = (await headers()).get("cookie");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/get-login-info`,
    {
      method: "GET",
      headers: {
        cookie: cookie ?? "",
      },
      next: { revalidate: 100 },
    }
  );
  const data = await response.json();
  return data;
};

const Home = async () => {
  const info = await getLoginInfo();
  console.log("info", info);

  return <Box>client side</Box>;
};

export default Home;
