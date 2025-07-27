import { Box } from "@mui/material";
import React from "react";

// import { IApplication } from "@/lib/apis/Application/ApplicationSlice";
import Onprogress from "./_components/Onprogress";

import { headers } from "next/headers";

// const getProcessApplication = async (): Promise<IApplication[]> => {
//   try {
//     // Use relative URL
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/api/process-applications`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         // Remove revalidate for SSR
//         cache: "no-store", // or "force-cache" if you want runtime caching
//       }
//     );

//     const data = await res.json();
//     return data?.data;
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// };

const getApplications = async () => {
  const cookie = (await headers()).get("cookie");

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v2/get-applications",
      {
        method: "GET",
        headers: {
          cookie: cookie ?? "",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const ProcessPage = async () => {
  const data = await getApplications();

  return (
    <Box sx={{ padding: "1rem" }}>
      <Onprogress data={data} />
    </Box>
  );
};

export default ProcessPage;
