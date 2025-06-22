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
  useEffect(() => {
    if (data?.length) {
      SocketIO.on("connect", () => {
        console.log("Web socket connect!");
      });

      return () => {
        SocketIO.disconnect();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container spacing={2}>
      {data?.map((item, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <ProcessCard data={item} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Onprogress;
