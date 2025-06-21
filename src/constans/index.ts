const center: { [key: number]: string } = {
  1: "Dhaka",
  3: "Rajshahi",
};

const ivac: { [key: number]: string } = {
  2: "IVAC, Rajshahi",
  17: "IVAC, Dhaka",
};

const visaType: { [key: number]: string } = {
  13: "Medical",
  6: "Entry",
};

export const getCenter = (id: number): string => {
  return center[id];
};

export const getIvac = (id: number): string => {
  return ivac[id];
};

export const getVisaType = (id: number): string => {
  return visaType[id];
};
