"use client";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { IApplication } from "@/interfaces/clientInterfaces";
import { getCenter, getIVAC, getVisaType } from "@/constans";
import ServerCell from "./_components/ServerCell";

export interface IApplicationTableHead {
  label: string;
  align: "left" | "center" | "right";
  width?: string;
}

interface IProps {
  allApplications: IApplication[];
}
const ApplicationTable: React.FC<IProps> = ({ allApplications }) => {
  const getStatus = (file: IApplication) => {
    if (file.status && file.paymentStatus?.status === "SUCCESS") {
      return "Completed";
    } else if (!file.status && file.paymentStatus?.status === "SUCCESS") {
      return "On Payment";
    } else {
      return "On Progress";
    }
  };

  return allApplications?.length > 0 ? (
    <>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.1)",
          border: "1px solid #e0e0e0",
        }}
      >
        <Table aria-label="Top 10 items table">
          <TableHead
            sx={{
              borderRadius: "0.25rem",
              background: "#F7F5F2",
              padding: {
                sm: "1rem 1.3125rem 1rem 1.25rem",
                xs: "0.75rem 2rem 0.75rem 1rem",
              },
            }}
          >
            <TableRow
              sx={{
                "& th": {
                  color: "#0B0B29",
                  fontSize: { sm: "0.875rem", xs: "0.75rem" },
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: { sm: "1.3125rem", xs: "1.125rem" },
                },
              }}
            >
              <TableCell align={"left"}>Application info</TableCell>
              <TableCell align={"left"}>IVAC Info</TableCell>
              <TableCell align={"left"}>Visa Type</TableCell>
              <TableCell width={"30%"} align={"center"}>
                Server Info
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody
            sx={{
              "& tr> th,td": {
                color: "#0B0B29",
                fontSize: { sm: "0.875rem", xs: "0.75rem" },
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: { sm: "1.3125rem", xs: "1.125rem" },
                borderBottomColor: "rgba(0, 0, 0, 0.10) !important",
              },
            }}
          >
            {!allApplications?.length ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box
                    sx={{
                      width: "100%",
                      height: "250px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>
                      No item found!
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              allApplications?.map((item: IApplication, i: number) => {
                return (
                  <TableRow
                    key={i}
                    sx={{
                      color: `${
                        getStatus(item) === "Completed"
                          ? "#12825F"
                          : getStatus(item) === "On Progress"
                          ? "#EE9322"
                          : getStatus(item) === "On Payment"
                          ? "#4096FF"
                          : "#3939CC"
                      } !important`,
                      bgcolor: `${
                        getStatus(item) === "Completed"
                          ? "#DFFAF2"
                          : getStatus(item) === "On Progress"
                          ? "#FDF3E6"
                          : getStatus(item) === "On Payment"
                          ? "#E6F4FF"
                          : "#EBEBFF"
                      } !important`,
                    }}
                  >
                    {/* <TableCell width={200}>
                      <Box>
                        <Typography>
                          {(item?.companyId as IClient)?.companyName}
                        </Typography>
                        <Typography>
                          {(item?.assignTo as IUser)?.name}
                        </Typography>
                        <Typography>
                          Date: {dayjs(item?.updatedAt).format("DD/MM/YYYY")}
                        </Typography>
                      </Box>
                    </TableCell> */}

                    <TableCell width={300}>
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: "12px" }}>
                          Web files - {item?.info?.length}
                        </Typography>
                        {item?.info?.map((item, i) => {
                          return (
                            <Typography
                              key={i}
                              sx={{
                                fontSize: "12px",
                                fontWeight: 500,
                                lineHeight: "15px",
                              }}
                            >
                              {i + 1}. {item?.name}, {item?.web_id}
                            </Typography>
                          );
                        })}
                      </Box>
                    </TableCell>

                    <TableCell width={200}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "12px",
                          lineHeight: "15px",
                        }}
                      >
                        {getIVAC(item?.ivac as number)?.ivac_name}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "12px",
                          lineHeight: "15px",
                        }}
                      >
                        {getCenter(item?.center as number)?.c_name}
                      </Typography>
                    </TableCell>

                    <TableCell width={200}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "12px",
                          lineHeight: "15px",
                        }}
                      >
                        {getVisaType(item?.visaType as number)?.type_name}
                      </Typography>
                    </TableCell>

                    <TableCell width={100}>
                      <ServerCell _id={item._id as string} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  ) : (
    <Box
      sx={{
        height: "200px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: { xs: "18px", md: "24px" },
        }}
      >
        No data found!
      </Typography>
    </Box>
  );
};

export default ApplicationTable;
