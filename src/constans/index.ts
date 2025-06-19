const center: { [key: number]: string } = {
  3: "Rajshahi",
};

const ivac: { [key: number]: string } = {
  2: "IVAC, Rajshahi",
};

const visaType: { [key: number]: string } = {
  6: "Medical",
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
