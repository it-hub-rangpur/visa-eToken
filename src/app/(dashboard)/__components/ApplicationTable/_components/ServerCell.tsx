import { Box, MenuItem, Select, Typography } from "@mui/material";
import React from "react";
import Servers from "@/db/servers.json";

interface Props {
  _id: string;
}

const ServerCell: React.FC<Props> = ({ _id }) => {
  const [selectedServers, setSelectedServers] = React.useState(() => {
    const serverInfo = localStorage?.getItem("serverInfo");
    if (serverInfo) {
      return JSON.parse(serverInfo);
    } else {
      return [];
    }
  });

  const [assaignedServer, setAssignedServer] = React.useState<string | null>(
    () => {
      const select = selectedServers?.find(
        (item: { applicationId: string }) => item.applicationId === _id
      );
      return select?.serverId || null;
    }
  );

  const handleSelectServer = (value: string) => {
    const serverInfo = localStorage.getItem("serverInfo");
    const selectedServersInfo = serverInfo ? JSON.parse(serverInfo) : [];

    const remain = selectedServersInfo?.filter(
      (item: { applicationId: string }) => item.applicationId !== _id
    );

    const data = {
      applicationId: _id,
      serverId: value,
    };

    const updated = [...remain, data];

    setSelectedServers(updated);
    localStorage.setItem("serverInfo", JSON.stringify(updated));
    setAssignedServer(value);
  };

  return (
    <Box sx={{}}>
      <Typography
        sx={{
          color: assaignedServer ? "green" : "red",
          fontSize: "16px",
          textAlign: "center",
        }}
      >
        {assaignedServer ? "Server assigned!" : "Server not assigned!"}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 1 }}>
        <Select
          onChange={(e) => handleSelectServer(e.target.value)}
          size="small"
          sx={{
            width: "80%",
          }}
          value={assaignedServer || ""}
          displayEmpty
          renderValue={() => {
            return assaignedServer
              ? Servers?.find((item) => item?.id === assaignedServer)?.name
              : "Select server";
          }}
          disableInjectingGlobalStyles
        >
          {Servers?.map((item, i) => {
            return (
              <MenuItem key={i} value={item?.id}>
                {item?.name}
              </MenuItem>
            );
          })}
        </Select>
      </Box>
    </Box>
  );
};

export default ServerCell;
