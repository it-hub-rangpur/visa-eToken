"use client";

import { Grid } from "@mui/material";
import React, { useEffect } from "react";
import ProcessCard from "../ProcessCard";
import { IApplication } from "@/lib/apis/Application/ApplicationSlice";
import SocketIO from "@/Socket";

interface IProps {
  data: IApplication[];
}

const Onprogress: React.FC<IProps> = ({ data }) => {
  const [serverInfo, setServerInfo] = React.useState<
    { applicationId: string }[]
  >([]);

  const applications = serverInfo?.map((item) => {
    return data?.find((app) => app._id === item.applicationId);
  });

  useEffect(() => {
    if (data?.length) {
      SocketIO.on("connect", () => {
        console.log("Web socket connect!");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const serverInfo = localStorage?.getItem("serverInfo");
    if (serverInfo) {
      setServerInfo(JSON.parse(serverInfo));
    } else {
      setServerInfo([]);
    }
  }, []);

  return (
    <Grid container spacing={2}>
      {applications?.map((item, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <ProcessCard data={item as IApplication} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Onprogress;
